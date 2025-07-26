"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Calendar, User, Clock, Star, MapPin, Filter, Video, MessageCircle } from "lucide-react"
import Link from "next/link"

// Mock data matching backend table structure
const user = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  gender: "male",
  preferences: {
    preferred_therapist_gender: "any",
    specialties: ["Anxiety", "Depression", "Stress Management"],
    session_types: ["Video Call"], // Only online
    preferred_times: ["Morning", "Afternoon"]
  }
}

const upcomingBookings = [
  {
    id: 1,
    therapist_id: 1,
    therapist: {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Anxiety & Depression",
      hourly_rate: 120,
      gender: "female"
    },
    session_date: "2025-01-15",
    session_time: "10:00 AM",
    duration: 50,
    session_type: "Video Call",
    status: "confirmed",
    total_amount: 100
  },
  {
    id: 2,
    therapist_id: 2,
    therapist: {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Addiction Recovery",
      hourly_rate: 150,
      gender: "male"
    },
    session_date: "2025-01-18",
    session_time: "2:30 PM",
    duration: 60,
    session_type: "Video Call",
    status: "confirmed",
    total_amount: 150
  }
]

const recommendedTherapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    rating: 4.8,
    review_count: 127,
    location: "New York, NY",
    hourly_rate: 120,
    gender: "female",
    availability: "Available this week",
    match_score: 95,
    session_types: ["Video Call"] // Only online
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Addiction Recovery",
    rating: 4.9,
    review_count: 89,
    location: "Los Angeles, CA",
    hourly_rate: 150,
    gender: "male",
    availability: "Available next week",
    match_score: 88,
    session_types: ["Video Call"]
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Trauma & PTSD",
    rating: 4.7,
    review_count: 156,
    location: "Chicago, IL",
    hourly_rate: 130,
    gender: "female",
    availability: "Available today",
    match_score: 92,
    session_types: ["Video Call"]
  }
]

const recentActivity = [
  {
    id: 1,
    type: "booking_created",
    message: "Booked session with Dr. Sarah Johnson",
    timestamp: "2024-01-10T14:30:00Z"
  },
  {
    id: 2,
    type: "session_completed",
    message: "Completed session with Dr. Michael Chen",
    timestamp: "2024-01-03T15:00:00Z"
  },
  {
    id: 3,
    type: "review_submitted",
    message: "Submitted review for Dr. Sarah Johnson",
    timestamp: "2024-01-05T10:15:00Z"
  }
]

export default function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
         <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your mental health journey</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push("/user/sessions") }>
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <Button size="sm" onClick={() => router.push("/user/profile") }>
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/user/recommendations")}
          tabIndex={0}
          role="button"
          aria-label="Go to Recommendations"
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Get Recommendations</h3>
                <p className="text-sm text-gray-600">Personalized suggestions</p>
              </div>
            </div>
          </CardContent>
        </Card>


        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/user/profile")}
          tabIndex={0}
          role="button"
          aria-label="Go to Session History"
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Session History</h3>
                <p className="text-sm text-gray-600">View past sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>
                Your next scheduled therapy sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{booking.therapist.name}</h4>
                        <p className="text-sm text-gray-600">{booking.therapist.specialty}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {new Date(booking.session_date).toLocaleDateString()} at {booking.session_time}
                          </span>
                          <span className="text-xs text-gray-500">{booking.duration} min</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {booking.session_type}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            ${booking.total_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => router.push("/user/sessions") }>
                  View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Therapists */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recommended Therapists</CardTitle>
              <CardDescription>
                Therapists that match your preferences and needs
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/user/recommendations") }>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedTherapists.map((therapist) => (
              <Card
                key={therapist.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/user/therapist/${therapist.id}`)}
                tabIndex={0}
                role="button"
                aria-label={`View profile for ${therapist.name}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{therapist.name}</h4>
                      <p className="text-sm text-gray-600">{therapist.specialty}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{therapist.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({therapist.review_count} reviews)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{therapist.location}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {therapist.availability}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          ${therapist.hourly_rate}/hr
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {therapist.match_score}% Match
                        </span>
                      </div>
                      <Button size="sm" className="w-full mt-3" onClick={e => { e.stopPropagation(); router.push(`/user/schedule?therapist=${therapist.id}`) }}>
                        Book Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => router.push("/user/recommendations") }>
              View All Recommended Therapists
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}