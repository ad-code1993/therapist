"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Clock, Calendar, User, Phone, Video, MessageCircle, Award, BookOpen, Clock as TimeIcon, CheckCircle } from "lucide-react"

// Mock data matching backend table structure
const therapist = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialty: "Anxiety & Depression",
  bio: "I am a licensed clinical psychologist specializing in cognitive behavioral therapy (CBT) for anxiety and depression. With over 8 years of experience, I help individuals develop practical coping strategies and work through challenging life transitions. My approach is warm, collaborative, and evidence-based.",
  long_bio: "I believe in creating a safe, non-judgmental space where clients feel heard and supported. My therapeutic approach combines cognitive behavioral therapy with mindfulness techniques to help you develop practical tools for managing anxiety, depression, and stress. I work with adults and adolescents, and I'm particularly experienced in helping people navigate life transitions, relationship issues, and trauma recovery.",
  credentials: [
    "Ph.D. in Clinical Psychology - Columbia University",
    "M.A. in Psychology - New York University",
    "B.A. in Psychology - University of California, Berkeley"
  ],
  certifications: [
    "Licensed Clinical Psychologist (NY State)",
    "Certified in Cognitive Behavioral Therapy",
    "Trauma-Informed Care Specialist",
    "Mindfulness-Based Stress Reduction (MBSR) Certified"
  ],
  specialties: ["Anxiety", "Depression", "Trauma", "Stress Management", "Life Transitions", "Relationship Issues"],
  approaches: ["Cognitive Behavioral Therapy (CBT)", "Mindfulness-Based Therapy", "Trauma-Informed Care", "Solution-Focused Therapy"],
  hourly_rate: 120,
  gender: "female",
  location: "New York, NY",
  experience_years: 8,
  languages: ["English", "Spanish"],
  session_types: ["Video Call", "In-Person"],
  availability: "Available this week",
  rating: 4.8,
  review_count: 127,
  session_lengths: ["50 minutes", "60 minutes", "90 minutes"],
  availability_slots: {
    monday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
    tuesday: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
    wednesday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
    thursday: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
    friday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
    saturday: ["10:00 AM", "11:00 AM"],
    sunday: []
  }
}

const reviews = [
  {
    id: 1,
    user_id: 1,
    therapist_id: 1,
    rating: 5,
    comment: "Dr. Johnson is incredibly compassionate and professional. She helped me develop practical strategies for managing my anxiety that I still use daily.",
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: 2,
    user_id: 2,
    therapist_id: 1,
    rating: 5,
    comment: "I've been seeing Dr. Johnson for 6 months and the progress I've made is remarkable. She's patient, understanding, and truly cares about her clients.",
    created_at: "2024-01-05T14:30:00Z"
  },
  {
    id: 3,
    user_id: 3,
    therapist_id: 1,
    rating: 4,
    comment: "Great therapist with a warm approach. Helped me work through some difficult life transitions. Highly recommend.",
    created_at: "2023-12-28T16:45:00Z"
  }
]

export default function TherapistProfile() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedSessionType, setSelectedSessionType] = useState("Video Call")
  const [selectedSessionLength, setSelectedSessionLength] = useState("50 minutes")

  const availableTimes = selectedDate ? therapist.availability_slots[selectedDate.toLowerCase() as keyof typeof therapist.availability_slots] || [] : []

  const calculatePrice = (length: string) => {
    const minutes = parseInt(length.split(' ')[0])
    return Math.round((therapist.hourly_rate * minutes) / 60)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{therapist.name}</h1>
            <p className="text-gray-600 mt-1">{therapist.specialty}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Therapist Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold ml-1">{therapist.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({therapist.review_count} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {therapist.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {therapist.experience_years} years experience
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span className="capitalize">{therapist.gender}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {therapist.session_types.map((type, index) => (
                        <span key={index} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed">{therapist.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About Dr. {therapist.name.split(' ')[1]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">{therapist.long_bio}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Education</h4>
                    <ul className="space-y-2">
                      {therapist.credentials.map((credential, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          {credential}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                    <ul className="space-y-2">
                      {therapist.certifications.map((cert, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <Award className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specialties & Approaches */}
            <Card>
              <CardHeader>
                <CardTitle>Specialties & Approaches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialties.map((specialty, index) => (
                        <span key={index} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Therapeutic Approaches</h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.approaches.map((approach, index) => (
                        <span key={index} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          {approach}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>What clients say about their experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Client</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book a Session</CardTitle>
                <CardDescription>Schedule your appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedSessionType}
                    onChange={(e) => setSelectedSessionType(e.target.value)}
                  >
                    {therapist.session_types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Length</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedSessionLength}
                    onChange={(e) => setSelectedSessionLength(e.target.value)}
                  >
                    {therapist.session_lengths.map((length) => (
                      <option key={length} value={length}>{length}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Select a date</option>
                    {Object.keys(therapist.availability_slots).map((day) => (
                      <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Session Price</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${calculatePrice(selectedSessionLength)}
                    </span>
                  </div>
                  <Button className="w-full" disabled={!selectedDate || !selectedTime}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{therapist.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{therapist.experience_years} years experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 capitalize">{therapist.gender}</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{therapist.languages.join(", ")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-green-600">${therapist.hourly_rate}/hr</span>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>Weekly schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(therapist.availability_slots).map(([day, times]) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{day}</span>
                      <span className="text-xs text-gray-500">
                        {times.length > 0 ? `${times.length} slots` : 'Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 