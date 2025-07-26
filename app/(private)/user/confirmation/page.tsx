"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, User, Video, MapPin, Download, MessageCircle } from "lucide-react"

// Mock booking data matching backend table structure
const bookingDetails = {
  id: "BK-2024-001",
  user_id: 1,
  therapist_id: 1,
  therapist: {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    location: "New York, NY",
    hourly_rate: 120
  },
  session_date: "2024-01-15",
  session_time: "10:00 AM",
  duration: 50,
  session_type: "Video Call",
  hourly_rate: 120,
  total_amount: 100,
  status: "confirmed",
  created_at: "2024-01-10T14:30:00Z"
}

export default function BookingConfirmation() {
  const router = useRouter()

  const handleDownloadCalendar = () => {
    // Parse the time properly
    const timeStr = bookingDetails.session_time
    const [time, period] = timeStr.split(' ')
    const [hours, minutes] = time.split(':')
    
    let hour = parseInt(hours)
    if (period === 'PM' && hour !== 12) hour += 12
    if (period === 'AM' && hour === 12) hour = 0
    
    // Create proper date objects
    const sessionDate = new Date(bookingDetails.session_date)
    sessionDate.setHours(hour, parseInt(minutes), 0, 0)
    
    const endDate = new Date(sessionDate)
    endDate.setMinutes(endDate.getMinutes() + bookingDetails.duration)
    
    // Format dates for .ics file (YYYYMMDDTHHMMSSZ format)
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    // Create .ics file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Therapy Session with ${bookingDetails.therapist.name}
DESCRIPTION:Session with ${bookingDetails.therapist.name} - ${bookingDetails.therapist.specialty}
DTSTART:${formatDate(sessionDate)}
DTEND:${formatDate(endDate)}
LOCATION:Video Call
END:VEVENT
END:VCALENDAR`
    
    // Create and download file
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'therapy-session.ics'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleMessageTherapist = () => {
    // Handle messaging therapist
    console.log("Opening message to therapist")
    // In a real app, this would open a messaging interface
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="text-gray-600 mt-2">Your session has been successfully scheduled</p>
          </div>
        </div>

        {/* Booking Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Your session information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking ID */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Booking ID</span>
              <span className="font-mono font-medium">{bookingDetails.id}</span>
            </div>

            {/* Therapist Info */}
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{bookingDetails.therapist.name}</h3>
                <p className="text-sm text-blue-600">{bookingDetails.therapist.specialty}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {bookingDetails.therapist.location}
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">
                  {new Date(bookingDetails.session_date).toLocaleDateString()} at {bookingDetails.session_time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{bookingDetails.duration} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Session Type</span>
                <span className="font-medium flex items-center gap-1">
                  {bookingDetails.session_type === "Video Call" ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {bookingDetails.session_type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Hourly Rate</span>
                <span className="font-medium">${bookingDetails.hourly_rate}/hr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-lg font-semibold text-green-600">${bookingDetails.total_amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded capitalize">
                  {bookingDetails.status}
                </span>
              </div>
            </div>

            {/* Confirmation Time */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Confirmed on {new Date(bookingDetails.created_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Important information about your session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Session Reminder</h4>
                  <p className="text-sm text-gray-600">
                    You'll receive a reminder 24 hours before your session via email and SMS.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Video Call Setup</h4>
                  <p className="text-sm text-gray-600">
                    For video sessions, you'll receive a secure link 15 minutes before your appointment.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Pre-Session Forms</h4>
                  <p className="text-sm text-gray-600">
                    Complete any required forms before your session to make the most of your time.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2">Cancellation Policy</h5>
              <p className="text-sm text-yellow-700">
                You can cancel or reschedule your session up to 24 hours before the appointment without any charges.
                Late cancellations may incur a fee.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">Privacy & Confidentiality</h5>
              <p className="text-sm text-blue-700">
                All sessions are confidential and protected by HIPAA regulations. Your privacy is our top priority.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={handleDownloadCalendar}>
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleMessageTherapist}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Message Therapist
          </Button>
        </div>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/user/sessions")}>
            View My Appointments
          </Button>
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at support@therapist.com
          </p>
        </div>
      </div>
    </div>
  )
} 