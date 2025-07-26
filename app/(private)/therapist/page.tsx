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

  const requests: Request[] = [
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
  ];

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Therapist Dashboard</h1>
        <p className="text-gray-600">Welcome back, {therapist.name}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Profile Information</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedTherapist.name}
                    onChange={(e) => setEditedTherapist({...editedTherapist, name: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{therapist.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    value={editedTherapist.email}
                    onChange={(e) => setEditedTherapist({...editedTherapist, email: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{therapist.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedTherapist.phone_number}
                    onChange={(e) => setEditedTherapist({...editedTherapist, phone_number: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{therapist.phone_number}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={editedTherapist.location}
                    onChange={(e) => setEditedTherapist({...editedTherapist, location: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{therapist.location}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="qualification">Qualification</Label>
                {isEditing ? (
                  <Input
                    id="qualification"
                    value={editedTherapist.qualification}
                    onChange={(e) => setEditedTherapist({...editedTherapist, qualification: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{therapist.qualification}</p>
                )}
              </div>
              <div>
                <Label htmlFor="hourly_rate">Hourly Rate</Label>
                {isEditing ? (
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={editedTherapist.hourly_rate}
                    onChange={(e) => setEditedTherapist({...editedTherapist, hourly_rate: parseInt(e.target.value)})}
                  />
                ) : (
                  <p className="text-sm text-gray-900">${therapist.hourly_rate}/hour</p>
                )}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                {isEditing ? (
                  <Input
                    id="age"
                    type="number"
                    value={editedTherapist.age}
                    onChange={(e) => setEditedTherapist({...editedTherapist, age: parseInt(e.target.value)})}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{therapist.age} years old</p>
                )}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <select
                    id="gender"
                    value={editedTherapist.gender}
                    onChange={(e) => setEditedTherapist({...editedTherapist, gender: e.target.value as any})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non_binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <Badge className={getGenderColor(therapist.gender)}>
                    {therapist.gender}
                  </Badge>
                )}
              </div>
              <div>
                <Label htmlFor="verification">Verification Status</Label>
                <Badge className={getVerificationColor(therapist.verification)}>
                  {therapist.verification}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Label htmlFor="description">Professional Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={editedTherapist.description}
                onChange={(e) => setEditedTherapist({...editedTherapist, description: e.target.value})}
                rows={4}
              />
            ) : (
              <p className="text-sm text-gray-900 mt-2">{therapist.description}</p>
            )}
          </div>
          {isEditing && (
            <div className="flex space-x-2 mt-6">
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
        <h2 className="text-2xl font-bold text-gray-900">Snapshot of Today's Activity</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Upcoming Sessions
                </CardTitle>
                <Badge variant="secondary">{sessions.filter(s => s.status === 'confirmed').length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
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
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Pending Requests
                </CardTitle>
                <Badge variant="secondary">{requests.filter(r => r.status === 'pending').length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {requests.filter(r => r.status === 'pending').slice(0, 3).map((request) => (
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
                    <Button size="sm" variant="outline" className="text-xs">
                      Respond
                    </Button>
                  </div>
                </div>
              ))}
              {requests.filter(r => r.status === 'pending').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No pending requests</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Clients */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Recent Clients
                </CardTitle>
                <Badge variant="secondary">{clients.filter(c => c.status === 'active').length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
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
  );
}
