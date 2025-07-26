"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Edit, 
  Save, 
  X, 
  Calendar,
  Clock,
  Star,
  MapPin,
  FileText,
  Award,
  MessageSquare,
  Video,
  Users,
  DollarSign,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon,
  UserCheck,
  CalendarDays,
  Bell,
  UserCircle
} from "lucide-react";

interface TherapistProfile {
  therapist_id: number;
  name: string;
  email: string;
  phone_number: string;
  qualification: string;
  description: string;
  location: string;
  hourly_rate: number;
  age: number;
  gender: "male" | "female" | "non_binary" | "other";
  verification: "pending" | "verified" | "rejected";
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

interface Session {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  status: "confirmed" | "pending" | "cancelled";
}

interface Request {
  id: string;
  clientName: string;
  message: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  urgency: "low" | "medium" | "high";
}

interface Client {
  id: string;
  name: string;
  email: string;
  lastSession: string;
  totalSessions: number;
  nextSession?: string;
  status: "active" | "inactive";
}

const sampleTherapist: TherapistProfile = {
  therapist_id: 1,
  name: "Dr. Sarah Williams",
  email: "sarah.williams@therapy.com",
  phone_number: "+1 (555) 123-4567",
  qualification: "Ph.D. in Clinical Psychology, Stanford University",
  description: "I am a licensed clinical psychologist with over 8 years of experience helping individuals overcome anxiety, depression, and trauma. I specialize in evidence-based treatments including Cognitive Behavioral Therapy (CBT) and Eye Movement Desensitization and Reprocessing (EMDR). My approach is warm, collaborative, and tailored to each client's unique needs.",
  location: "San Francisco, CA",
  hourly_rate: 150,
  age: 35,
  gender: "female",
  verification: "verified",
  created_at: "2022-03-15",
  updated_at: "2024-01-15"
};

const sampleSessions: Session[] = [
  {
    id: "1",
    clientName: "Emma Johnson",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: 60,
    type: "video",
    status: "confirmed"
  },
  {
    id: "2",
    clientName: "Michael Chen",
    date: "2024-01-15",
    time: "2:00 PM",
    duration: 45,
    type: "in-person",
    status: "confirmed"
  },
  {
    id: "3",
    clientName: "Sarah Davis",
    date: "2024-01-15",
    time: "4:30 PM",
    duration: 60,
    type: "video",
    status: "pending"
  },
  {
    id: "4",
    clientName: "David Wilson",
    date: "2024-01-16",
    time: "9:00 AM",
    duration: 60,
    type: "phone",
    status: "confirmed"
  }
];

const sampleRequests: Request[] = [
  {
    id: "1",
    clientName: "Jennifer Smith",
    message: "I'm looking for help with anxiety and would like to schedule a consultation.",
    date: "2024-01-15",
    status: "pending",
    urgency: "medium"
  },
  {
    id: "2",
    clientName: "Robert Brown",
    message: "Need urgent help with depression. Available for evening sessions.",
    date: "2024-01-15",
    status: "pending",
    urgency: "high"
  },
  {
    id: "3",
    clientName: "Lisa Garcia",
    message: "Interested in couples counseling. Both partners available on weekends.",
    date: "2024-01-14",
    status: "pending",
    urgency: "low"
  }
];

const sampleClients: Client[] = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma.johnson@email.com",
    lastSession: "2024-01-10",
    totalSessions: 12,
    nextSession: "2024-01-15",
    status: "active"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    lastSession: "2024-01-08",
    totalSessions: 8,
    nextSession: "2024-01-15",
    status: "active"
  },
  {
    id: "3",
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    lastSession: "2024-01-12",
    totalSessions: 5,
    nextSession: "2024-01-15",
    status: "active"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@email.com",
    lastSession: "2024-01-05",
    totalSessions: 15,
    nextSession: "2024-01-16",
    status: "active"
  },
  {
    id: "5",
    name: "Jennifer Smith",
    email: "jennifer.smith@email.com",
    lastSession: "2024-01-03",
    totalSessions: 3,
    status: "inactive"
  }
];

const sampleTherapists: TherapistProfile[] = [
  sampleTherapist,
  {
    therapist_id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@therapy.com",
    phone_number: "+1 (555) 234-5678",
    qualification: "LCSW, Master of Social Work, UC Berkeley",
    description: "Licensed clinical social worker with 12 years of experience in couples therapy and family counseling.",
    location: "Oakland, CA",
    hourly_rate: 140,
    age: 42,
    gender: "male",
    verification: "verified",
    created_at: "2022-05-10",
    updated_at: "2024-01-15"
  },
  {
    therapist_id: 3,
    name: "Dr. Emma Rodriguez",
    email: "emma.rodriguez@therapy.com",
    phone_number: "+1 (555) 345-6789",
    qualification: "LMFT, Master of Marriage and Family Therapy, UCLA",
    description: "Licensed marriage and family therapist specializing in trauma, EMDR, and CBT.",
    location: "Los Angeles, CA",
    hourly_rate: 130,
    age: 38,
    gender: "female",
    verification: "pending",
    created_at: "2023-01-13",
    updated_at: "2024-01-15"
  }
];

export default function TherapistDashboard() {
  const [profile, setProfile] = useState<TherapistProfile>(sampleTherapist);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<TherapistProfile>(profile);
  const [sessions] = useState<Session[]>(sampleSessions);
  const [requests] = useState<Request[]>(sampleRequests);
  const [clients] = useState<Client[]>(sampleClients);

  const handleEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const handleInputChange = (field: keyof TherapistProfile, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'in-person': return <UserCheck className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <CalendarDays className="h-4 w-4" />;
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "male": return "bg-blue-100 text-blue-800";
      case "female": return "bg-pink-100 text-pink-800";
      case "non_binary": return "bg-purple-100 text-purple-800";
      case "other": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationColor = (verification: string) => {
    switch (verification) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Therapist Dashboard</h1>
          <p className="text-gray-600">Manage your profile and practice</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{sessions.filter(s => s.status === 'confirmed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
                  <p className="text-2xl font-bold text-gray-900">${profile.hourly_rate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Profile Section */}
        <div className="space-y-6 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getVerificationColor(profile.verification)}>
                      {profile.verification}
                    </Badge>
                    <Badge className={getGenderColor(profile.gender)}>
                      {profile.gender}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Age: {profile.age}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone_number">Phone</Label>
                      <Input
                        id="phone_number"
                        value={editForm.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editForm.age}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        value={editForm.hourly_rate}
                        onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        value={editForm.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non_binary">Non-binary</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input
                        id="qualification"
                        value={editForm.qualification}
                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="mt-1"
                      rows={4}
                      placeholder="Tell clients about your approach and experience..."
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email</p>
                            <p className="text-sm text-gray-600">{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Phone</p>
                            <p className="text-sm text-gray-600">{profile.phone_number}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Location</p>
                            <p className="text-sm text-gray-600">{profile.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <UserCircle className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Age</p>
                            <p className="text-sm text-gray-600">{profile.age} years old</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Gender</p>
                            <p className="text-sm text-gray-600">{profile.gender}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Hourly Rate</p>
                            <p className="text-sm text-gray-600">${profile.hourly_rate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Qualification</p>
                            <p className="text-sm text-gray-600">{profile.qualification}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Verification Status</p>
                            <p className="text-sm text-gray-600">{profile.verification}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">About Me</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Created: {profile.created_at}</p>
                        <p>Last Updated: {profile.updated_at}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
