"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, Clock, Star, Settings, Edit, Save, X, Download, Filter } from "lucide-react"

// Mock user data matching backend table structure
const userProfile = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  date_of_birth: "1990-05-15",
  gender: "male",
  location: "New York, NY",
  emergency_contact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543"
  },
  preferences: {
    preferred_therapist_gender: "any",
    specialties: ["Anxiety", "Depression", "Stress Management"],
    session_types: ["Video Call", "In-Person"],
    preferred_times: ["Morning", "Afternoon"]
  },
  insurance: {
    provider: "Blue Cross Blue Shield",
    member_id: "BCBS123456789",
    group_number: "GRP001"
  }
}

// Mock session history from bookings table
const sessionHistory = [
  {
    id: 1,
    therapist_id: 1,
    therapist: {
      name: "Dr. Sarah Johnson",
      specialty: "Anxiety & Depression"
    },
    session_date: "2024-01-10",
    session_time: "10:00 AM",
    duration: 50,
    session_type: "Video Call",
    status: "completed",
    hourly_rate: 120,
    total_amount: 100,
    rating: 5,
    notes: "Great session, discussed anxiety management techniques"
  },
  {
    id: 2,
    therapist_id: 2,
    therapist: {
      name: "Dr. Michael Chen",
      specialty: "Addiction Recovery"
    },
    session_date: "2024-01-03",
    session_time: "2:30 PM",
    duration: 60,
    session_type: "In-Person",
    status: "completed",
    hourly_rate: 150,
    total_amount: 150,
    rating: 4,
    notes: "Focused on addiction recovery strategies"
  },
  {
    id: 3,
    therapist_id: 1,
    therapist: {
      name: "Dr. Sarah Johnson",
      specialty: "Anxiety & Depression"
    },
    session_date: "2023-12-27",
    session_time: "10:00 AM",
    duration: 50,
    session_type: "Video Call",
    status: "completed",
    hourly_rate: 120,
    total_amount: 100,
    rating: 5,
    notes: "Continued work on depression management"
  }
]

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState(userProfile)

  const handleSave = () => {
    setIsEditing(false)
    // Handle save logic here
    console.log("Profile saved:", profile)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setProfile(userProfile) // Reset to original data
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Contact information for emergencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profile.emergency_contact.name}
                onChange={(e) => setProfile({
                  ...profile,
                  emergency_contact: { ...profile.emergency_contact, name: e.target.value }
                })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <input
                type="text"
                value={profile.emergency_contact.relationship}
                onChange={(e) => setProfile({
                  ...profile,
                  emergency_contact: { ...profile.emergency_contact, relationship: e.target.value }
                })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.emergency_contact.phone}
                onChange={(e) => setProfile({
                  ...profile,
                  emergency_contact: { ...profile.emergency_contact, phone: e.target.value }
                })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
          <CardDescription>Your health insurance details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <input
                type="text"
                value={profile.insurance.provider}
                onChange={(e) => setProfile({
                  ...profile,
                  insurance: { ...profile.insurance, provider: e.target.value }
                })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
              <input
                type="text"
                value={profile.insurance.member_id}
                onChange={(e) => setProfile({
                  ...profile,
                  insurance: { ...profile.insurance, member_id: e.target.value }
                })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
              <input
                type="text"
                value={profile.insurance.group_number}
                onChange={(e) => setProfile({
                  ...profile,
                  insurance: { ...profile.insurance, group_number: e.target.value }
                })}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Session Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Session Preferences</CardTitle>
          <CardDescription>Your preferred session settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Therapist Gender</label>
            <select
              value={profile.preferences.preferred_therapist_gender}
              onChange={(e) => setProfile({
                ...profile,
                preferences: { ...profile.preferences, preferred_therapist_gender: e.target.value }
              })}
              disabled={!isEditing}
              className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
            >
              <option value="any">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Session Types</label>
            <div className="space-y-2">
              {["Video Call", "In-Person", "Phone Call"].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.preferences.session_types.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...profile.preferences.session_types, type]
                        : profile.preferences.session_types.filter(t => t !== type)
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, session_types: newTypes }
                      })
                    }}
                    disabled={!isEditing}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Specialties</label>
            <div className="grid grid-cols-2 gap-2">
              {["Anxiety", "Depression", "Trauma", "Addiction", "Couples Therapy", "Stress Management"].map((specialty) => (
                <label key={specialty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.preferences.specialties.includes(specialty)}
                    onChange={(e) => {
                      const newSpecialties = e.target.checked
                        ? [...profile.preferences.specialties, specialty]
                        : profile.preferences.specialties.filter(s => s !== specialty)
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, specialties: newSpecialties }
                      })
                    }}
                    disabled={!isEditing}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{specialty}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Times</label>
            <div className="space-y-2">
              {["Morning", "Afternoon", "Evening"].map((time) => (
                <label key={time} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.preferences.preferred_times.includes(time)}
                    onChange={(e) => {
                      const newTimes = e.target.checked
                        ? [...profile.preferences.preferred_times, time]
                        : profile.preferences.preferred_times.filter(t => t !== time)
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, preferred_times: newTimes }
                      })
                    }}
                    disabled={!isEditing}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{time}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderHistoryTab = () => (
    <div className="space-y-6">
      {/* Session History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Your past therapy sessions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessionHistory.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{session.therapist.name}</h4>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">{session.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.session_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.session_time} ({session.duration} min)
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {session.session_type}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        ${session.total_amount}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        session.status === 'completed' ? 'bg-green-100 text-green-700' :
                        session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    {session.notes && (
                      <p className="text-sm text-gray-600">{session.notes}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
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
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "preferences", label: "Preferences", icon: Settings },
            { id: "history", label: "Session History", icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "preferences" && renderPreferencesTab()}
        {activeTab === "history" && renderHistoryTab()}
      </div>
    </div>
  )
} 