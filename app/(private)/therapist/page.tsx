"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Bell, 
  Users, 
  Edit3, 
  Save, 
  X,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Star
} from "lucide-react";
import { 
  sampleTherapists, 
  sampleBookings, 
  sampleReviews,
  getTherapistStats,
  getBookingsByTherapistId,
  getReviewsByTherapistId,
  type Therapist,
  type Booking,
  type Review
} from "@/lib/sample-data";

interface Session {
  id: string;
  clientName: string;
  time: string;
  duration: number;
  type: "video" | "phone" | "chat";
  status: "confirmed" | "pending" | "cancelled";
}

interface Request {
  id: string;
  clientName: string;
  message: string;
  date: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected";
}

interface Client {
  id: string;
  name: string;
  totalSessions: number;
  lastSession: string;
  nextSession?: string;
  status: "active" | "inactive";
}

export default function TherapistDashboard() {
  // Using the first therapist as the logged-in therapist
  const [therapist] = useState<Therapist>(sampleTherapists[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTherapist, setEditedTherapist] = useState<Therapist>(therapist);

  const stats = getTherapistStats(therapist.therapist_id);
  const bookings = getBookingsByTherapistId(therapist.therapist_id);
  const reviews = getReviewsByTherapistId(therapist.therapist_id);

  // Sample data for dashboard
  const sessions: Session[] = [
    {
      id: "1",
      clientName: "John Doe",
      time: "10:00 AM",
      duration: 60,
      type: "video",
      status: "confirmed"
    },
    {
      id: "2",
      clientName: "Sarah Smith",
      time: "2:00 PM",
      duration: 90,
      type: "phone",
      status: "confirmed"
    },
    {
      id: "3",
      clientName: "Mike Johnson",
      time: "4:00 PM",
      duration: 60,
      type: "video",
      status: "pending"
    }
  ];

  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      clientName: "Emma Wilson",
      message: "I need to reschedule my session from tomorrow to next week. Is that possible?",
      date: "2024-02-15",
      urgency: "medium",
      status: "pending"
    },
    {
      id: "2",
      clientName: "David Brown",
      message: "Can we extend our session to 90 minutes? I have some urgent matters to discuss.",
      date: "2024-02-16",
      urgency: "high",
      status: "pending"
    }
  ]);

  const handleRequestAction = (id: string, action: "approved" | "rejected") => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const clients: Client[] = [
    {
      id: "1",
      name: "John Doe",
      totalSessions: 8,
      lastSession: "2024-02-10",
      nextSession: "2024-02-15",
      status: "active"
    },
    {
      id: "2",
      name: "Sarah Smith",
      totalSessions: 12,
      lastSession: "2024-02-08",
      status: "active"
    },
    {
      id: "3",
      name: "Mike Johnson",
      totalSessions: 3,
      lastSession: "2024-02-05",
      nextSession: "2024-02-17",
      status: "active"
    }
  ];

  const handleSave = () => {
    // In a real app, this would save to the database
    console.log("Saving therapist data:", editedTherapist);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTherapist(therapist);
    setIsEditing(false);
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case "phone":
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case "chat":
        return <div className="w-2 h-2 bg-purple-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "male":
        return "bg-blue-100 text-blue-800";
      case "female":
        return "bg-pink-100 text-pink-800";
      case "non_binary":
        return "bg-purple-100 text-purple-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationColor = (verification: string) => {
    switch (verification) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Therapist Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back, {therapist.name}</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalBookings}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Completed Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completedBookings}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalReviews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-900">Profile Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedTherapist.name}
                      onChange={(e) => setEditedTherapist({...editedTherapist, name: e.target.value})}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-2">{therapist.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      value={editedTherapist.email}
                      onChange={(e) => setEditedTherapist({...editedTherapist, email: e.target.value})}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-2">{therapist.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedTherapist.phone_number}
                      onChange={(e) => setEditedTherapist({...editedTherapist, phone_number: e.target.value})}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-2">{therapist.phone_number}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editedTherapist.location}
                      onChange={(e) => setEditedTherapist({...editedTherapist, location: e.target.value})}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-2">{therapist.location}</p>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">Qualification</Label>
                  {isEditing ? (
                    <Input
                      id="qualification"
                      value={editedTherapist.qualification}
                      onChange={(e) => setEditedTherapist({...editedTherapist, qualification: e.target.value})}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-2">{therapist.qualification}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="hourly_rate" className="text-sm font-medium text-gray-700">Hourly Rate</Label>
                  {isEditing ? (
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={editedTherapist.hourly_rate}
                      onChange={(e) => setEditedTherapist({...editedTherapist, hourly_rate: parseInt(e.target.value)})}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-2">${therapist.hourly_rate}/hour</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age</Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      type="number"
                      value={editedTherapist.age}
                      onChange={(e) => setEditedTherapist({...editedTherapist, age: parseInt(e.target.value)})}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 mt-2">{therapist.age} years old</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
                  {isEditing ? (
                    <select
                      id="gender"
                      value={editedTherapist.gender}
                      onChange={(e) => setEditedTherapist({...editedTherapist, gender: e.target.value as any})}
                      className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non_binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <Badge className={`mt-2 ${getGenderColor(therapist.gender)}`}>
                      {therapist.gender}
                    </Badge>
                  )}
                </div>
                <div>
                  <Label htmlFor="verification" className="text-sm font-medium text-gray-700">Verification Status</Label>
                  <Badge className={`mt-2 ${getVerificationColor(therapist.verification)}`}>
                    {therapist.verification}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Professional Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={editedTherapist.description}
                  onChange={(e) => setEditedTherapist({...editedTherapist, description: e.target.value})}
                  rows={4}
                  className="mt-2"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-2">{therapist.description}</p>
              )}
            </div>
            {isEditing && (
              <div className="flex space-x-3 mt-8">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Activity Snapshot */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Snapshot of Today's Activity</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Sessions */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3 bg-blue-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center text-blue-800">
                      <Calendar className="h-5 w-5 mr-2" />
                      Upcoming Sessions
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">{sessions.filter(s => s.status === 'confirmed').length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {sessions.filter(s => s.status === 'confirmed').slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getSessionTypeIcon(session.type)}
                        <div>
                          <p className="font-medium text-sm">{session.clientName}</p>
                          <p className="text-xs text-gray-600">{session.time} • {session.duration}min</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  ))}
                  {sessions.filter(s => s.status === 'confirmed').length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No upcoming sessions today</p>
                  )}
                </CardContent>
              </Card>

              {/* Pending Requests */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3 bg-orange-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center text-orange-800">
                      <Bell className="h-5 w-5 mr-2" />
                      Pending Requests
                    </CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">{requests.filter(r => r.status === 'pending').length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {requests.slice(0, 3).map((request) => (
                    <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{request.clientName}</p>
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{request.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{request.date}</span>
                        {request.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1" onClick={() => handleRequestAction(request.id, "approved")}>Accept</Button>
                            <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-600 hover:bg-red-50 px-3 py-1" onClick={() => handleRequestAction(request.id, "rejected")}>Decline</Button>
                          </div>
                        ) : (
                          <Badge className={request.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {request.status === "approved" ? "Accepted" : "Declined"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No requests</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Clients */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3 bg-green-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center text-green-800">
                      <Users className="h-5 w-5 mr-2" />
                      Recent Clients
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">{clients.filter(c => c.status === 'active').length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {clients.filter(c => c.status === 'active').slice(0, 3).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{client.name}</p>
                          <p className="text-xs text-gray-600">{client.totalSessions} sessions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Last: {client.lastSession}</p>
                        {client.nextSession && (
                          <p className="text-xs text-blue-600">Next: {client.nextSession}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {clients.filter(c => c.status === 'active').length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent clients</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
