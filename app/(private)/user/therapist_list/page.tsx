"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Star, MapPin, Clock, Calendar, User, Phone, Video, MapPin as LocationIcon } from "lucide-react"

// Mock data matching backend table structure
const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    location: "New York, NY",
    hourly_rate: 120,
    experience_years: 8,
    review_count: 127,
    gender: "female",
    session_types: ["Video Call"],
    bio: "Specialized in treating anxiety and depression with evidence-based approaches."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Addiction Recovery",
    location: "Los Angeles, CA",
    hourly_rate: 150,
    experience_years: 12,
    review_count: 89,
    gender: "male",
    session_types: ["Video Call", "Group Sessions"],
    bio: "Expert in addiction recovery with a compassionate, non-judgmental approach."
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Trauma Therapy",
    location: "Chicago, IL",
    hourly_rate: 140,
    experience_years: 10,
    review_count: 156,
    gender: "female",
    session_types: ["Video Call"],
    bio: "Specialized in trauma-informed therapy and PTSD treatment."
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Couples Therapy",
    location: "Miami, FL",
    hourly_rate: 130,
    experience_years: 6,
    review_count: 94,
    gender: "male",
    session_types: ["Video Call"],
    bio: "Focused on helping couples build stronger, healthier relationships."
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Child & Adolescent Therapy",
    location: "Seattle, WA",
    hourly_rate: 125,
    experience_years: 9,
    review_count: 112,
    gender: "female",
    session_types: ["Video Call", "Play Therapy"],
    bio: "Specialized in child and adolescent mental health with play therapy techniques."
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Stress Management",
    location: "Austin, TX",
    hourly_rate: 110,
    experience_years: 7,
    review_count: 78,
    gender: "male",
    session_types: ["Video Call"],
    bio: "Helping clients manage stress and develop healthy coping mechanisms."
  }
]

const specialties = [
  "Anxiety", "Depression", "Trauma", "Addiction", "Couples Therapy",
  "Child Psychology", "Eating Disorders", "Stress Management", "PTSD"
]

const locations = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Miami, FL",
  "Seattle, WA", "Boston, MA", "Remote"
]

const genders = ["male", "female", "any"]

const sessionTypes = ["Video Call", "Group Sessions", "Play Therapy"]

export default function TherapistDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedSessionType, setSelectedSessionType] = useState("")
  const [selectedPriceRange, setSelectedPriceRange] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         therapist.bio.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSpecialty = !selectedSpecialty || therapist.specialty === selectedSpecialty
    const matchesLocation = !selectedLocation || therapist.location === selectedLocation
    const matchesGender = !selectedGender || selectedGender === "any" || therapist.gender === selectedGender
    const matchesSessionType = !selectedSessionType || therapist.session_types.includes(selectedSessionType)
    
    let matchesPrice = true
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number)
      if (max) {
        matchesPrice = therapist.hourly_rate >= min && therapist.hourly_rate <= max
      } else {
        matchesPrice = therapist.hourly_rate >= min
      }
    }

    return matchesSearch && matchesSpecialty && matchesLocation && matchesGender && matchesSessionType && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Your Therapist</h1>
            <p className="text-gray-600 mt-1">Connect with licensed professionals who can help you on your journey</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              My Appointments
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for therapists, specialties, or keywords..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Narrow down your search to find the perfect therapist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                  >
                    <option value="">Any Gender</option>
                    {genders.map(gender => (
                      <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Session Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedSessionType}
                    onChange={(e) => setSelectedSessionType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {sessionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                  >
                    <option value="">Any Price</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-150">$100 - $150</option>
                    <option value="150-200">$150 - $200</option>
                    <option value="200-">$200+</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => {
                  setSelectedSpecialty("")
                  setSelectedLocation("")
                  setSelectedGender("")
                  setSelectedSessionType("")
                  setSelectedPriceRange("")
                }}>
                  Clear Filters
                </Button>
                <span className="text-sm text-gray-600">
                  {filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTherapists.map((therapist) => (
            <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Therapist Avatar */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>

                  {/* Therapist Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{therapist.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{therapist.specialty}</p>
                        
                        {/* Reviews */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 ml-1">({therapist.review_count} reviews)</span>
                          </div>
                        </div>

                        {/* Location and Experience */}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {therapist.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {therapist.experience_years} years experience
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="capitalize">{therapist.gender}</span>
                          </div>
                        </div>

                        {/* Session Types */}
                        <div className="flex items-center gap-2 mt-3">
                          {therapist.session_types.map((type, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {type}
                            </span>
                          ))}
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <span className="text-lg font-semibold text-green-600">${therapist.hourly_rate}/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                      <Button size="sm" variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTherapists.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No therapists found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("")
                setSelectedSpecialty("")
                setSelectedLocation("")
                setSelectedGender("")
                setSelectedSessionType("")
                setSelectedPriceRange("")
              }}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 