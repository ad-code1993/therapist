"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  sampleTherapists, 
  sampleComplaints, 
  getComplaintsByStatus,
  getTherapistById,
  getPatientById,
  type Therapist,
  type Complaint
} from "@/lib/sample-data";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("verifications");
  const [verifications, setVerifications] = useState<Therapist[]>(
    sampleTherapists.filter(t => t.verification === "pending")
  );
  const [complaints] = useState<Complaint[]>(sampleComplaints);

  const handleVerificationAction = (therapistId: number, action: "approve" | "reject") => {
    setVerifications(prev => 
      prev.filter(t => t.therapist_id !== therapistId)
    );
  };

  const handleRevokeTherapist = (therapistId: number) => {
    // In a real app, this would update the database
    console.log(`Revoking therapist ${therapistId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getComplaintStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "dismissed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingComplaints = getComplaintsByStatus("pending");
  const resolvedComplaints = getComplaintsByStatus("resolved");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Manage therapist verifications and handle complaints</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{verifications.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Verified Therapists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{sampleTherapists.filter(t => t.verification === "verified").length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Pending Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingComplaints.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Resolved Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{resolvedComplaints.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-6">
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
                All Therapists ({sampleTherapists.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Therapist Verifications */}
            {activeTab === "verifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Therapist Verification Requests</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Therapist</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Qualification</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rate</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifications.map((therapist) => (
                        <tr key={therapist.therapist_id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {therapist.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span>{therapist.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{therapist.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{therapist.location}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{therapist.qualification}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">${therapist.hourly_rate}/hr</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(therapist.verification)}>
                              {therapist.verification}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleVerificationAction(therapist.therapist_id, "approve")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleVerificationAction(therapist.therapist_id, "reject")}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Complaints List */}
            {activeTab === "complaints" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
                </div>

                <div className="space-y-4">
                  {complaints.map((complaint) => {
                    const patient = getPatientById(complaint.user_id);
                    const therapist = complaint.therapist_id ? getTherapistById(complaint.therapist_id) : null;
                    
                    return (
                      <Card key={complaint.complaint_id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                              <p className="text-sm text-gray-600">
                                Filed by {patient?.user_name || `User ${complaint.user_id}`}
                                {therapist && ` against ${therapist.name}`}
                              </p>
                            </div>
                            <Badge className={getComplaintStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <p className="text-gray-700 mb-4">{complaint.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Filed: {new Date(complaint.created_at).toLocaleDateString()}</span>
                            {complaint.status === "resolved" && (
                              <span>Resolved: {new Date(complaint.resolved_at!).toLocaleDateString()}</span>
                            )}
                          </div>
                          {complaint.status === "pending" && (
                            <div className="flex space-x-2 mt-4">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Resolve
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Therapists */}
            {activeTab === "therapists" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">All Therapists</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Phone</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Qualification</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleTherapists.map((therapist) => (
                        <tr key={therapist.therapist_id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {therapist.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span>{therapist.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{therapist.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{therapist.phone_number}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{therapist.location}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{therapist.qualification}</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(therapist.verification)}>
                              {therapist.verification}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
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
      </div>
    </div>
  );
}
