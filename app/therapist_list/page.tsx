import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data for public therapist list
const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    qualification: "Ph.D. Clinical Psychology",
    location: "San Francisco, CA",
    hourly_rate: 150,
    gender: "female",
    description: "Specializes in anxiety, depression, and trauma therapy with 10+ years of experience.",
    verification: "verified"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    qualification: "M.S. Marriage and Family Therapy",
    location: "Los Angeles, CA",
    hourly_rate: 120,
    gender: "male",
    description: "Expert in couples counseling and family dynamics with a compassionate approach.",
    verification: "verified"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    qualification: "Psy.D. Clinical Psychology",
    location: "New York, NY",
    hourly_rate: 180,
    gender: "female",
    description: "Specializes in cognitive behavioral therapy and stress management techniques.",
    verification: "verified"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    qualification: "Ph.D. Counseling Psychology",
    location: "Chicago, IL",
    hourly_rate: 140,
    gender: "male",
    description: "Focuses on addiction recovery and mental health support for young adults.",
    verification: "verified"
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    qualification: "M.S. Clinical Social Work",
    location: "Austin, TX",
    hourly_rate: 110,
    gender: "female",
    description: "Specializes in grief counseling and life transition support.",
    verification: "verified"
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    qualification: "Ph.D. Clinical Psychology",
    location: "Seattle, WA",
    hourly_rate: 160,
    gender: "male",
    description: "Expert in trauma therapy and PTSD treatment with evidence-based approaches.",
    verification: "verified"
  }
];

export default function TherapistList() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Therapist
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our verified therapists and find the right match for your mental health journey.
            </p>
          </div>
        </div>
      </section>

      {/* Therapist List */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{therapist.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{therapist.qualification}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {therapist.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      ${therapist.hourly_rate}/hour
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {therapist.gender === "male" ? "Male" : "Female"}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {therapist.description}
                    </p>
                    <div className="pt-2">
                      <Link href="/signup">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Book Session
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Sign up today to book sessions with our verified therapists and take the first step towards better mental health.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 