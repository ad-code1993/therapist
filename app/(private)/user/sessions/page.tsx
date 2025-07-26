"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, User, Video, MessageCircle, Clock, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for all sessions (upcoming and past)
const allSessions = [
  {
    id: 1,
    therapist: {
      name: "Dr. Sarah Johnson",
      specialty: "Anxiety & Depression"
    },
    session_date: "2024-01-15",
    session_time: "10:00 AM",
    duration: 50,
    session_type: "Video Call",
    total_amount: 100,
    status: "confirmed"
  },
  {
    id: 2,
    therapist: {
      name: "Dr. Michael Chen",
      specialty: "Addiction Recovery"
    },
    session_date: "2024-01-18",
    session_time: "2:30 PM",
    duration: 60,
    session_type: "Video Call",
    total_amount: 150,
    status: "confirmed"
  },
  {
    id: 3,
    therapist: {
      name: "Dr. Emily Rodriguez",
      specialty: "Trauma Therapy"
    },
    session_date: "2024-01-10",
    session_time: "3:00 PM",
    duration: 90,
    session_type: "Video Call",
    total_amount: 225,
    status: "completed"
  },
  {
    id: 4,
    therapist: {
      name: "Dr. James Wilson",
      specialty: "Couples Therapy"
    },
    session_date: "2024-01-25",
    session_time: "11:00 AM",
    duration: 60,
    session_type: "Video Call",
    total_amount: 180,
    status: "pending"
  }
]

export default function SessionsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  // Separate upcoming and past sessions
  const today = new Date()
  const upcomingSessions = allSessions.filter(session => 
    new Date(session.session_date) >= today
  )
  const pastSessions = allSessions.filter(session => 
    new Date(session.session_date) < today
  )

  // Group sessions by date
  const sessionsByDate = allSessions.reduce((acc, session) => {
    if (!acc[session.session_date]) acc[session.session_date] = []
    acc[session.session_date].push(session)
    return acc
  }, {} as Record<string, typeof allSessions>)

  const sortedDates = Object.keys(sessionsByDate).sort()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-700"
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "completed": return "bg-blue-100 text-blue-700"
      case "cancelled": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const handleSessionAction = (action: string, sessionId: number) => {
    console.log(`${action} session ${sessionId}`)
    // Handle session actions (message, join, cancel, etc.)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-blue-600" />
              My Sessions
            </h1>
            <p className="text-gray-600 mt-1">Manage and view all your therapy sessions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1">
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
            <Button variant="outline" onClick={() => router.push("/user")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">{upcomingSessions.length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Sessions</p>
                  <p className="text-2xl font-bold text-green-600">{pastSessions.length}</p>
                </div>
                <User className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-purple-600">{allSessions.length}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {viewMode === "calendar" ? (
          /* Calendar View */
          <div className="space-y-6">
            {sortedDates.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
                  <p className="text-gray-600 mb-4">You have no sessions scheduled on your calendar.</p>
                  <Button onClick={() => router.push("/user/therapist_list")}>Find a Therapist</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {sortedDates.map(date => (
                  <Card key={date}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-500" />
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sessionsByDate[date].map(session => (
                          <div key={session.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{session.therapist.name}</h4>
                                <p className="text-sm text-gray-600">{session.therapist.specialty}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {session.session_time}
                                  </span>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    {session.session_type}
                                  </span>
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    {session.duration} min
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(session.status)}`}>
                                    {session.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-green-600">
                                ${session.total_amount}
                              </span>
                              {session.status === "confirmed" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleSessionAction("message", session.id)}
                                  >
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Message
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleSessionAction("join", session.id)}
                                  >
                                    <Video className="w-4 h-4 mr-1" />
                                    Join
                                  </Button>
                                </>
                              )}
                              {session.status === "pending" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleSessionAction("cancel", session.id)}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Upcoming Sessions ({upcomingSessions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming sessions</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingSessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <span className="font-medium">{session.therapist.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({session.therapist.specialty})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{new Date(session.session_date).toLocaleDateString()} at {session.session_time}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          <span className="text-sm font-semibold">${session.total_amount}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Video className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-500" />
                  Past Sessions ({pastSessions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pastSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No past sessions</p>
                ) : (
                  <div className="space-y-3">
                    {pastSessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-green-600" />
                          <div>
                            <span className="font-medium">{session.therapist.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({session.therapist.specialty})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{new Date(session.session_date).toLocaleDateString()} at {session.session_time}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          <span className="text-sm font-semibold">${session.total_amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 