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
  MessageSquare,
  Star
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences: string;
  lastSession: string;
  nextSession: string;
  totalSessions: number;
  status: "active" | "inactive";
}

const sampleClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    preferences: "Prefers evening sessions, interested in CBT techniques, comfortable with video calls",
    lastSession: "2024-01-15",
    nextSession: "2024-01-22",
    totalSessions: 12,
    status: "active"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    preferences: "Morning sessions preferred, focuses on anxiety management, prefers in-person sessions",
    lastSession: "2024-01-14",
    nextSession: "2024-01-21",
    totalSessions: 8,
    status: "active"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    email: "emma.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    preferences: "Weekend availability, depression treatment, comfortable with both in-person and virtual",
    lastSession: "2024-01-13",
    nextSession: "2024-01-20",
    totalSessions: 15,
    status: "active"
  }
];

export default function TherapistDashboard() {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});

  const handleEdit = (client: Client) => {
    setEditingClient(client.id);
    setEditForm(client);
  };

  const handleSave = (clientId: string) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, ...editForm }
        : client
    ));
    setEditingClient(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingClient(null);
    setEditForm({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Therapist Dashboard</h1>
          <p className="text-gray-600">Manage your client profiles and sessions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sessions Today</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hours This Week</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Profiles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Client Profiles</h2>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <User className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>

          <div className="grid gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{client.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {client.totalSessions} sessions
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(client)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {editingClient === client.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`name-${client.id}`}>Name</Label>
                          <Input
                            id={`name-${client.id}`}
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`email-${client.id}`}>Email</Label>
                          <Input
                            id={`email-${client.id}`}
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`phone-${client.id}`}>Phone</Label>
                          <Input
                            id={`phone-${client.id}`}
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`status-${client.id}`}>Status</Label>
                          <select
                            id={`status-${client.id}`}
                            value={editForm.status || ''}
                            onChange={(e) => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive'})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`preferences-${client.id}`}>Preferences</Label>
                        <Textarea
                          id={`preferences-${client.id}`}
                          value={editForm.preferences || ''}
                          onChange={(e) => setEditForm({...editForm, preferences: e.target.value})}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleSave(client.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email</p>
                            <p className="text-sm text-gray-600">{client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Phone</p>
                            <p className="text-sm text-gray-600">{client.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Last Session</p>
                            <p className="text-sm text-gray-600">{client.lastSession}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Next Session</p>
                            <p className="text-sm text-gray-600">{client.nextSession}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">Preferences</p>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {client.preferences}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
