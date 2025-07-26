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
  MapPin
} from "lucide-react";

interface TherapistVerification {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  specialization: string;
  experience: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  documents: string[];
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
    id: "1",
    name: "Dr. Sarah Williams",
    email: "sarah.williams@therapy.com",
    phone: "+1 (555) 123-4567",
    license: "LPC-12345",
    specialization: "Anxiety, Depression, PTSD",
    experience: "8 years",
    submittedDate: "2024-01-15",
    status: "pending",
    documents: ["license.pdf", "certification.pdf", "background_check.pdf"]
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@therapy.com",
    phone: "+1 (555) 234-5678",
    license: "LCSW-67890",
    specialization: "Couples Therapy, Family Counseling",
    experience: "12 years",
    submittedDate: "2024-01-14",
    status: "approved",
    documents: ["license.pdf", "certification.pdf", "references.pdf"]
  },
  {
    id: "3",
    name: "Dr. Emma Rodriguez",
    email: "emma.rodriguez@therapy.com",
    phone: "+1 (555) 345-6789",
    license: "LMFT-11111",
    specialization: "Trauma, EMDR, CBT",
    experience: "6 years",
    submittedDate: "2024-01-13",
    status: "rejected",
    documents: ["license.pdf", "certification.pdf"]
  },
  {
    id: "4",
    name: "Dr. David Thompson",
    email: "david.thompson@therapy.com",
    phone: "+1 (555) 456-7890",
    license: "PsyD-22222",
    specialization: "Child Psychology, ADHD",
    experience: "15 years",
    submittedDate: "2024-01-12",
    status: "pending",
    documents: ["license.pdf", "certification.pdf", "background_check.pdf", "references.pdf"]
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
  const [activeTab, setActiveTab] = useState<"verifications" | "complaints">("verifications");

  const handleVerificationAction = (id: string, action: "approve" | "reject") => {
    setVerifications(verifications.map(v => 
      v.id === id 
        ? { ...v, status: action === "approve" ? "approved" : "rejected" }
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

  const pendingVerifications = verifications.filter(v => v.status === "pending").length;
  const openComplaints = complaints.filter(c => c.status === "open").length;
  const urgentComplaints = complaints.filter(c => c.priority === "urgent").length;

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
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "open": return "bg-red-100 text-red-800";
      case "investigating": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
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
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Therapists</p>
                  <p className="text-2xl font-bold text-gray-900">{verifications.length}</p>
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
                <Card key={verification.id} className="overflow-hidden">
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
                            <Badge className={getStatusColor(verification.status)}>
                              {verification.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              License: {verification.license}
                            </span>
                          </div>
                        </div>
                      </div>
                      {verification.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleVerificationAction(verification.id, "approve")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleVerificationAction(verification.id, "reject")}
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
                            <p className="text-sm text-gray-600">{verification.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Specialization</p>
                            <p className="text-sm text-gray-600">{verification.specialization}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Experience</p>
                            <p className="text-sm text-gray-600">{verification.experience}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">Submitted Documents</p>
                        </div>
                        <div className="space-y-2">
                          {verification.documents.map((doc, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{doc}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          Submitted: {verification.submittedDate}
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
      </div>
    </div>
  );
}
