"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar as CalendarIcon, User, ArrowLeft } from "lucide-react"

// Mock data for booked sessions (should match dashboard structure)
const bookedSessions = [
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
    total_amount: 100
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
    total_amount: 150
  }
]

export default function CalendarPage() {
  const router = useRouter()

  // Group sessions by date for a simple calendar-like view
  const sessionsByDate = bookedSessions.reduce((acc, session) => {
    if (!acc[session.session_date]) acc[session.session_date] = []
    acc[session.session_date].push(session)
    return acc
  }, {} as Record<string, typeof bookedSessions>)

  const sortedDates = Object.keys(sessionsByDate).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-blue-600" />
              My Calendar
            </h1>
            <p className="text-gray-600 mt-1">See all your booked sessions by date</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/user") }>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        {sortedDates.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions booked</h3>
              <p className="text-gray-600 mb-4">You have no sessions scheduled on your calendar.</p>
              <Button onClick={() => router.push("/user/therapist_list")}>Find a Therapist</Button>
            </CardContent>
          </Card>
        )}
        <div className="space-y-6">
          {sortedDates.map(date => (
            <Card key={date}>
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-900 text-lg">{new Date(date).toLocaleDateString()}</span>
                </div>
                <div className="space-y-3">
                  {sessionsByDate[date].map(session => (
                    <div key={session.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b last:border-b-0 pb-2 last:pb-0">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">{session.therapist.name}</span>
                        <span className="text-xs text-gray-500">({session.therapist.specialty})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {session.session_time}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {session.session_type}
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {session.duration} min
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          ${session.total_amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 