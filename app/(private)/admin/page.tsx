"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  MessageSquare,
  Star,
  Eye,
  Shield,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  UserCheck
} from "lucide-react";

interface TherapistVerification {
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
  created_at: string;
}

interface Complaint {
  id: string;
  complainantName: string;
  complainantEmail: string;
  therapistName: string;
  therapistEmail: string;
  complaintType: "professional" | "technical" | "billing" | "other";
  description: string;
  submittedDate: string;
  status: "open" | "investigating" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
}

const sampleVerifications: TherapistVerification[] = [
  {
    therapist_id: 1,
    name: "Dr. Sarah Williams",
    email: "sarah.williams@therapy.com",
    phone_number: "+1 (555) 123-4567",
    qualification: "Ph.D. in Clinical Psychology, Stanford University",
    description: "Licensed clinical psychologist with 8 years of experience specializing in anxiety, depression, and trauma.",
    location: "San Francisco, CA",
    hourly_rate: 150,
    age: 35,
    gender: "female",
    verification: "pending",
    created_at: "2024-01-15"
  },
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
    created_at: "2024-01-14"
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
    verification: "rejected",
    created_at: "2024-01-13"
  },
  {
    therapist_id: 4,
    name: "Dr. David Thompson",
    email: "david.thompson@therapy.com",
    phone_number: "+1 (555) 456-7890",
    qualification: "PsyD, Doctor of Psychology, Pepperdine University",
    description: "Child psychologist with 15 years of experience in ADHD and developmental disorders.",
    location: "San Diego, CA",
    hourly_rate: 160,
    age: 45,
    gender: "male",
    verification: "pending",
    created_at: "2024-01-12"
  }
];

const sampleComplaints: Complaint[] = [
  {
    id: "1",
    complainantName: "John Smith",
    complainantEmail: "john.smith@email.com",
    therapistName: "Dr. Sarah Williams",
    therapistEmail: "sarah.williams@therapy.com",
    complaintType: "professional",
    description: "Therapist was 15 minutes late to session and seemed unprepared. This has happened multiple times.",
    submittedDate: "2024-01-15",
    status: "open",
    priority: "medium"
  },
  {
    id: "2",
    complainantName: "Maria Garcia",
    complainantEmail: "maria.garcia@email.com",
    therapistName: "Dr. Michael Chen",
    therapistEmail: "michael.chen@therapy.com",
    complaintType: "technical",
    description: "Video call kept disconnecting during session. Audio quality was poor throughout.",
    submittedDate: "2024-01-14",
    status: "investigating",
    priority: "high"
  },
  {
    id: "3",
    complainantName: "Robert Johnson",
    complainantEmail: "robert.johnson@email.com",
    therapistName: "Dr. Emma Rodriguez",
    therapistEmail: "emma.rodriguez@therapy.com",
    complaintType: "billing",
    description: "Charged for session that was cancelled 24 hours in advance. Requesting refund.",
    submittedDate: "2024-01-13",
    status: "resolved",
    priority: "low"
  },
  {
    id: "4",
    complainantName: "Lisa Davis",
    complainantEmail: "lisa.davis@email.com",
    therapistName: "Dr. David Thompson",
    therapistEmail: "david.thompson@therapy.com",
    complaintType: "other",
    description: "Therapist shared personal information about other clients during our session.",
    submittedDate: "2024-01-12",
    status: "open",
    priority: "urgent"
  }
];

export default function AdminDashboard() {
  const [verifications, setVerifications] = useState<TherapistVerification[]>(sampleVerifications);
  const [complaints, setComplaints] = useState<Complaint[]>(sampleComplaints);
  const [activeTab, setActiveTab] = useState<"verifications" | "complaints" | "therapists">("verifications");

  const handleVerificationAction = (therapist_id: number, action: "verified" | "rejected") => {
    setVerifications(verifications.map(v => 
      v.therapist_id === therapist_id 
        ? { ...v, verification: action }
        : v
    ));
  };

  const handleComplaintStatus = (id: string, status: Complaint["status"]) => {
    setComplaints(complaints.map(c => 
      c.id === id 
        ? { ...c, status }
        : c
    ));
  };

  const handleRevokeTherapist = (therapist_id: number) => {
    setVerifications(prev => prev.map(t => 
      t.therapist_id === therapist_id 
        ? { ...t, verification: "rejected" }
        : t
    ));
  };

  const pendingVerifications = verifications.filter(v => v.verification === "pending").length;
  const verifiedTherapists = verifications.filter(v => v.verification === "verified").length;
  const openComplaints = complaints.filter(c => c.status === "open").length;
  const urgentComplaints = complaints.filter(c => c.priority === "urgent").length;
  const totalTherapists = verifications.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "open": return "bg-red-100 text-red-800";
      case "investigating": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage therapist verifications and handle complaints</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingVerifications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified Therapists</p>
                  <p className="text-2xl font-bold text-gray-900">{verifiedTherapists}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">{openComplaints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Urgent Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">{urgentComplaints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("verifications")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "verifications"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Therapist Verifications ({verifications.length})
              </button>
              <button
                onClick={() => setActiveTab("complaints")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "complaints"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Complaints ({complaints.length})
              </button>
              <button
                onClick={() => setActiveTab("therapists")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "therapists"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Therapist List ({totalTherapists})
              </button>
            </nav>
          </div>
        </div>

        {/* Verifications Section */}
        {activeTab === "verifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Therapist Verification Requests</h2>
            </div>

            <div className="grid gap-6">
              {verifications.map((verification) => (
                <Card key={verification.therapist_id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {verification.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl">{verification.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(verification.verification)}>
                              {verification.verification}
                            </Badge>
                            <Badge className={getGenderColor(verification.gender)}>
                              {verification.gender}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Age: {verification.age}
                            </span>
                          </div>
                        </div>
                      </div>
                      {verification.verification === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleVerificationAction(verification.therapist_id, "verified")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleVerificationAction(verification.therapist_id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email</p>
                            <p className="text-sm text-gray-600">{verification.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Phone</p>
                            <p className="text-sm text-gray-600">{verification.phone_number}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Location</p>
                            <p className="text-sm text-gray-600">{verification.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Hourly Rate</p>
                            <p className="text-sm text-gray-600">${verification.hourly_rate}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">Qualification</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{verification.qualification}</p>
                        
                        <div className="flex items-center space-x-3 mb-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">Description</p>
                        </div>
                        <p className="text-sm text-gray-600">{verification.description}</p>
                        
                        <div className="mt-4 text-sm text-gray-500">
                          Created: {verification.created_at}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Complaints Section */}
        {activeTab === "complaints" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
            </div>

            <div className="grid gap-6">
              {complaints.map((complaint) => (
                <Card key={complaint.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{complaint.complainantName}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getPriorityColor(complaint.priority)}>
                              {complaint.priority}
                            </Badge>
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              vs {complaint.therapistName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {complaint.status === "open" && (
                          <Button
                            size="sm"
                            onClick={() => handleComplaintStatus(complaint.id, "investigating")}
                          >
                            Investigate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Complainant Email</p>
                            <p className="text-sm text-gray-600">{complaint.complainantEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Therapist</p>
                            <p className="text-sm text-gray-600">{complaint.therapistName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Therapist Email</p>
                            <p className="text-sm text-gray-600">{complaint.therapistEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Submitted</p>
                            <p className="text-sm text-gray-600">{complaint.submittedDate}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">Complaint Details</p>
                        </div>
                        <div className="mb-3">
                          <Badge className="bg-blue-100 text-blue-800">
                            {complaint.complaintType}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {complaint.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Therapist List Section */}
        {activeTab === "therapists" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Therapists</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Qualification</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {verifications.map((therapist) => (
                    <tr key={therapist.therapist_id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {therapist.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{therapist.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{therapist.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{therapist.phone_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{therapist.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{therapist.qualification}</td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusColor(therapist.verification)}>
                          {therapist.verification}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          disabled={therapist.verification === 'rejected'}
                          onClick={() => handleRevokeTherapist(therapist.therapist_id)}
                        >
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
