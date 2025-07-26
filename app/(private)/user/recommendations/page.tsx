"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Clock, Calendar, User, Filter, Heart, MessageCircle } from "lucide-react"

// Mock recommended therapists
const recommendedTherapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    rating: 4.8,
    reviews: 127,
    location: "New York, NY",
    experience: "8 years",
    availability: "Available this week",
    price: "$120/session",
    matchScore: 95,
    matchReasons: ["Specializes in anxiety", "High rating", "Available this week"],
    image: "/api/placeholder/80/80"
  },
  {
    id: 2,
    name: "Dr. Emily Rodriguez",
    specialty: "Trauma & PTSD",
    rating: 4.7,
    reviews: 156,
    location: "Chicago, IL",
    experience: "10 years",
    availability: "Available today",
    price: "$130/session",
    matchScore: 92,
    matchReasons: ["Trauma specialist", "EMDR certified", "Available today"],
    image: "/api/placeholder/80/80"
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    specialty: "Addiction Recovery",
    rating: 4.9,
    reviews: 89,
    location: "Los Angeles, CA",
    experience: "12 years",
    availability: "Available next week",
    price: "$150/session",
    matchScore: 88,
    matchReasons: ["Addiction specialist", "Group sessions available", "High experience"],
    image: "/api/placeholder/80/80"
  },
  {
    id: 4,
    name: "Dr. Lisa Thompson",
    specialty: "Child & Adolescent",
    rating: 4.9,
    reviews: 94,
    location: "Seattle, WA",
    experience: "9 years",
    availability: "Available next week",
    price: "$110/session",
    matchScore: 85,
    matchReasons: ["Child psychology", "Play therapy", "Family sessions"],
    image: "/api/placeholder/80/80"
  },
  {
    id: 5,
    name: "Dr. James Wilson",
    specialty: "Couples Therapy",
    rating: 4.6,
    reviews: 203,
    location: "Miami, FL",
    experience: "15 years",
    availability: "Available this week",
    price: "$140/session",
    matchScore: 82,
    matchReasons: ["Couples specialist", "Communication focus", "Long experience"],
    image: "/api/placeholder/80/80"
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Eating Disorders",
    rating: 4.8,
    reviews: 67,
    location: "Boston, MA",
    experience: "11 years",
    availability: "Available this week",
    price: "$160/session",
    matchScore: 78,
    matchReasons: ["Eating disorder specialist", "CBT certified", "Body image focus"],
    image: "/api/placeholder/80/80"
  }
]

const userPreferences = {
  specialties: ["Anxiety", "Depression", "Trauma"],
  sessionTypes: ["Video Call", "In-Person"],
  preferredTimes: ["Morning", "Afternoon"],
  location: "New York, NY",
  maxPrice: "$150"
}

export default function TherapistRecommendations() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("match")

  const filteredTherapists = recommendedTherapists.filter(therapist => {
    if (selectedFilter === "available") {
      return therapist.availability.includes("Available today") || therapist.availability.includes("Available this week")
    }
    return true
  })

  const sortedTherapists = [...filteredTherapists].sort((a, b) => {
    if (sortBy === "match") {
      return b.matchScore - a.matchScore
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    } else if (sortBy === "price") {
      return parseInt(a.price.replace("$", "")) - parseInt(b.price.replace("$", ""))
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recommended Therapists</h1>
            <p className="text-gray-600 mt-1">Personalized recommendations based on your preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </div>
        </div>

        {/* User Preferences Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>Based on your profile and previous sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Specialties</h4>
                <p className="text-sm text-blue-700">{userPreferences.specialties.join(", ")}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Session Types</h4>
                <p className="text-sm text-green-700">{userPreferences.sessionTypes.join(", ")}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Preferred Times</h4>
                <p className="text-sm text-purple-700">{userPreferences.preferredTimes.join(", ")}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900">Max Price</h4>
                <p className="text-sm text-orange-700">{userPreferences.maxPrice}/session</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Sort */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Therapists</option>
                <option value="available">Available This Week</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="match">Best Match</option>
              <option value="rating">Highest Rating</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </div>

        {/* Therapist Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedTherapists.map((therapist) => (
            <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Therapist Avatar */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>

                  {/* Therapist Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{therapist.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{therapist.specialty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          {therapist.matchScore}% Match
                        </div>
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{therapist.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({therapist.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {therapist.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {therapist.experience} experience
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-1">Why we recommend this therapist:</p>
                      <div className="flex flex-wrap gap-1">
                        {therapist.matchReasons.map((reason, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and Availability */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-semibold text-green-600">{therapist.price}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-2">
                          {therapist.availability}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                      <Button size="sm" variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {sortedTherapists.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your preferences or filters</p>
              <Button variant="outline">
                Update Preferences
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {sortedTherapists.length > 0 && (
          <div className="text-center">
            <Button variant="outline">
              Load More Recommendations
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 