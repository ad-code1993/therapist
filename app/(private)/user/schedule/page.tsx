"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Video, MapPin, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"

// Mock therapist data (in real app, fetch by id)
const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    hourly_rate: 120,
    location: "New York, NY",
    gender: "female"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Addiction Recovery",
    hourly_rate: 150,
    location: "Los Angeles, CA",
    gender: "male"
  }
]

const availabilitySlots = {
  "2024-01-15": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "2024-01-16": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
  "2024-01-17": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "2024-01-18": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
  "2024-01-19": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
  "2024-01-20": ["10:00 AM", "11:00 AM"]
}

const sessionTypes = [
  { id: "video", name: "Video Call", icon: Video, description: "Secure video session from anywhere" }
]

const sessionLengths = [
  { id: "50", name: "50 minutes", description: "Standard session" },
  { id: "60", name: "60 minutes", description: "Extended session" },
  { id: "90", name: "90 minutes", description: "Intensive session" }
]

export default function ScheduleSession() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const therapistId = searchParams.get("therapist")
  const therapist = therapists.find(t => String(t.id) === therapistId)

  // If no therapist specified, show a message
  if (!therapist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Select a Therapist First</h2>
            <p className="text-gray-600 mb-4">You need to choose a therapist before scheduling a session.</p>
            <Button onClick={() => router.push("/user/therapist_list")}>Browse Therapists</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedSessionType, setSelectedSessionType] = useState("video")
  const [selectedSessionLength, setSelectedSessionLength] = useState("50")
  const [currentStep, setCurrentStep] = useState(1)

  const getCurrentPrice = () => {
    const length = sessionLengths.find(l => l.id === selectedSessionLength)
    if (!length) return 0
    const minutes = parseInt(length.id)
    return Math.round((therapist.hourly_rate * minutes) / 60)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime("")
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleNext = () => {
    if (currentStep === 1 && selectedDate && selectedTime) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConfirmBooking = () => {
    // Handle booking confirmation - this would create a new booking record
    const bookingData = {
      therapist_id: therapist.id,
      user_id: 1, // Current user ID
      session_date: selectedDate,
      session_time: selectedTime,
      duration: parseInt(selectedSessionLength),
      session_type: sessionTypes.find(t => t.id === selectedSessionType)?.name,
      hourly_rate: therapist.hourly_rate,
      total_amount: getCurrentPrice(),
      status: "pending"
    }
    
    console.log("Creating booking:", bookingData)
    // Here you would make an API call to create the booking
    
    // Navigate to confirmation page
    router.push("/user/confirmation")
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Therapist Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{therapist.name}</h3>
              <p className="text-sm text-blue-600">{therapist.specialty}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {therapist.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ${therapist.hourly_rate}/hr
                </div>
                <div className="flex items-center gap-1">
                  <span className="capitalize">{therapist.gender}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>Choose a date for your session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Object.keys(availabilitySlots).slice(0, 14).map((date) => {
              const slots = availabilitySlots[date as keyof typeof availabilitySlots]
              const isSelected = selectedDate === date
              const isToday = date === "2024-01-15" // Mock today's date
              
              return (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-500"
                      : isToday
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="text-xs font-medium">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-sm font-semibold">
                    {new Date(date).getDate()}
                  </div>
                  <div className="text-xs opacity-75">
                    {slots.length} slots
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Time Selection */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
            <CardDescription>Available times for {new Date(selectedDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {availabilitySlots[selectedDate as keyof typeof availabilitySlots]?.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    selectedTime === time
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Session Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Session Type</CardTitle>
          <CardDescription>Choose how you'd like to meet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessionTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedSessionType(type.id)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    selectedSessionType === type.id
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Session Length Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Session Length</CardTitle>
          <CardDescription>Choose the duration of your session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessionLengths.map((length) => {
              const minutes = parseInt(length.id)
              const price = Math.round((therapist.hourly_rate * minutes) / 60)
              
              return (
                <button
                  key={length.id}
                  onClick={() => setSelectedSessionLength(length.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedSessionLength === length.id
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{length.name}</h4>
                      <p className="text-sm text-gray-600">{length.description}</p>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      ${price}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
          <CardDescription>Review your session details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Therapist Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold">{therapist.name}</h4>
                <p className="text-sm text-gray-600">{therapist.specialty}</p>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">
                  {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Session Type</span>
                <span className="font-medium">
                  {sessionTypes.find(t => t.id === selectedSessionType)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">
                  {sessionLengths.find(l => l.id === selectedSessionLength)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hourly Rate</span>
                <span className="font-medium">
                  ${therapist.hourly_rate}/hr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-lg font-semibold text-green-600">
                  ${getCurrentPrice()}
                </span>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2">Cancellation Policy</h5>
              <p className="text-sm text-yellow-700">
                You can cancel or reschedule your session up to 24 hours before the appointment without any charges.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule Session</h1>
            <p className="text-gray-600 mt-1">Book your therapy session</p>
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {currentStep < 3 && selectedDate && selectedTime && (
              <Button size="sm" onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Final Action */}
        {currentStep === 3 && (
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button size="lg" onClick={handleConfirmBooking}>
              <Calendar className="w-5 h-5 mr-2" />
              Confirm Booking
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 