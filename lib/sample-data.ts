// Sample data for TherapistConnect app demonstration

export interface Therapist {
  therapist_id: number;
  email: string;
  name: string;
  verification: "pending" | "verified" | "rejected";
  age: number;
  gender: "male" | "female" | "non_binary" | "other";
  profile_picture?: string;
  description: string;
  qualification: string;
  phone_number: string;
  location: string;
  hourly_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  user_id: number;
  email: string;
  user_name: string;
  phone_number: string;
  gender: "male" | "female" | "non_binary" | "other";
  age: number;
  pref_gender: "male" | "female" | "non_binary" | "other";
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  booking_id: number;
  therapist_id: number;
  user_id: number;
  start_at: string;
  end_at: string;
  status: "requested" | "confirmed" | "cancelled" | "completed";
  hourly_rate: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  slot_id?: number;
}

export interface Review {
  review_id: number;
  therapist_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface AvailabilitySlot {
  slot_id: number;
  therapist_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  date_override?: string;
  created_at: string;
}

export interface Complaint {
  complaint_id: number;
  user_id: number;
  therapist_id?: number;
  subject: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
  resolved_at?: string;
}

// Sample Therapists
export const sampleTherapists: Therapist[] = [
  {
    therapist_id: 1,
    email: "dr.sarah.johnson@therapy.com",
    name: "Dr. Sarah Johnson",
    verification: "verified",
    age: 35,
    gender: "female",
    profile_picture: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    description: "Specializes in anxiety, depression, and trauma therapy with 10+ years of experience. Uses evidence-based approaches including CBT and EMDR.",
    qualification: "Ph.D. Clinical Psychology, Stanford University",
    phone_number: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    hourly_rate: 150,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    therapist_id: 2,
    email: "dr.michael.chen@therapy.com",
    name: "Dr. Michael Chen",
    verification: "verified",
    age: 42,
    gender: "male",
    profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    description: "Expert in couples counseling and family dynamics with a compassionate approach. Specializes in relationship issues and communication skills.",
    qualification: "M.S. Marriage and Family Therapy, UCLA",
    phone_number: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    hourly_rate: 120,
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-10T09:00:00Z"
  },
  {
    therapist_id: 3,
    email: "dr.emily.rodriguez@therapy.com",
    name: "Dr. Emily Rodriguez",
    verification: "verified",
    age: 38,
    gender: "female",
    profile_picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    description: "Specializes in cognitive behavioral therapy and stress management techniques. Works with adults and adolescents.",
    qualification: "Psy.D. Clinical Psychology, Columbia University",
    phone_number: "+1 (555) 345-6789",
    location: "New York, NY",
    hourly_rate: 180,
    created_at: "2024-01-12T11:00:00Z",
    updated_at: "2024-01-12T11:00:00Z"
  },
  {
    therapist_id: 4,
    email: "dr.james.wilson@therapy.com",
    name: "Dr. James Wilson",
    verification: "verified",
    age: 45,
    gender: "male",
    profile_picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "Focuses on addiction recovery and mental health support for young adults. Uses a combination of therapy approaches.",
    qualification: "Ph.D. Counseling Psychology, University of Chicago",
    phone_number: "+1 (555) 456-7890",
    location: "Chicago, IL",
    hourly_rate: 140,
    created_at: "2024-01-08T08:00:00Z",
    updated_at: "2024-01-08T08:00:00Z"
  },
  {
    therapist_id: 5,
    email: "dr.lisa.thompson@therapy.com",
    name: "Dr. Lisa Thompson",
    verification: "pending",
    age: 33,
    gender: "female",
    profile_picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    description: "Specializes in grief counseling and life transition support. Helps clients navigate major life changes and loss.",
    qualification: "M.S. Clinical Social Work, University of Texas",
    phone_number: "+1 (555) 567-8901",
    location: "Austin, TX",
    hourly_rate: 110,
    created_at: "2024-01-20T14:00:00Z",
    updated_at: "2024-01-20T14:00:00Z"
  }
];

// Sample Patients
export const samplePatients: Patient[] = [
  {
    user_id: 1,
    email: "john.doe@email.com",
    user_name: "john_doe",
    phone_number: "+1 (555) 111-2222",
    gender: "male",
    age: 28,
    pref_gender: "female",
    description: "Looking for help with anxiety and work-related stress. Prefer female therapists.",
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-05T10:00:00Z"
  },
  {
    user_id: 2,
    email: "sarah.smith@email.com",
    user_name: "sarah_smith",
    phone_number: "+1 (555) 222-3333",
    gender: "female",
    age: 35,
    pref_gender: "other",
    description: "Seeking couples counseling with my partner. No gender preference.",
    created_at: "2024-01-07T11:00:00Z",
    updated_at: "2024-01-07T11:00:00Z"
  },
  {
    user_id: 3,
    email: "mike.johnson@email.com",
    user_name: "mike_johnson",
    phone_number: "+1 (555) 333-4444",
    gender: "male",
    age: 42,
    pref_gender: "male",
    description: "Dealing with depression and addiction recovery. Prefer male therapists.",
    created_at: "2024-01-09T09:00:00Z",
    updated_at: "2024-01-09T09:00:00Z"
  },
  {
    user_id: 4,
    email: "emma.wilson@email.com",
    user_name: "emma_wilson",
    phone_number: "+1 (555) 444-5555",
    gender: "female",
    age: 26,
    pref_gender: "female",
    description: "Looking for trauma therapy and PTSD support. Prefer female therapists.",
    created_at: "2024-01-11T13:00:00Z",
    updated_at: "2024-01-11T13:00:00Z"
  },
  {
    user_id: 5,
    email: "david.brown@email.com",
    user_name: "david_brown",
    phone_number: "+1 (555) 555-6666",
    gender: "male",
    age: 31,
    pref_gender: "other",
    description: "Seeking help with relationship issues and communication skills.",
    created_at: "2024-01-13T15:00:00Z",
    updated_at: "2024-01-13T15:00:00Z"
  }
];

// Sample Bookings
export const sampleBookings: Booking[] = [
  {
    booking_id: 1,
    therapist_id: 1,
    user_id: 1,
    start_at: "2024-02-15T10:00:00Z",
    end_at: "2024-02-15T11:00:00Z",
    status: "confirmed",
    hourly_rate: 150,
    total_amount: 150,
    created_at: "2024-02-10T09:00:00Z",
    updated_at: "2024-02-10T09:00:00Z"
  },
  {
    booking_id: 2,
    therapist_id: 2,
    user_id: 2,
    start_at: "2024-02-16T14:00:00Z",
    end_at: "2024-02-16T15:30:00Z",
    status: "confirmed",
    hourly_rate: 120,
    total_amount: 180,
    created_at: "2024-02-11T10:00:00Z",
    updated_at: "2024-02-11T10:00:00Z"
  },
  {
    booking_id: 3,
    therapist_id: 3,
    user_id: 3,
    start_at: "2024-02-17T16:00:00Z",
    end_at: "2024-02-17T17:00:00Z",
    status: "requested",
    hourly_rate: 180,
    total_amount: 180,
    created_at: "2024-02-12T11:00:00Z",
    updated_at: "2024-02-12T11:00:00Z"
  },
  {
    booking_id: 4,
    therapist_id: 4,
    user_id: 4,
    start_at: "2024-02-18T09:00:00Z",
    end_at: "2024-02-18T10:00:00Z",
    status: "completed",
    hourly_rate: 140,
    total_amount: 140,
    created_at: "2024-02-08T08:00:00Z",
    updated_at: "2024-02-13T10:00:00Z"
  },
  {
    booking_id: 5,
    therapist_id: 1,
    user_id: 5,
    start_at: "2024-02-19T13:00:00Z",
    end_at: "2024-02-19T14:00:00Z",
    status: "cancelled",
    hourly_rate: 150,
    total_amount: 150,
    created_at: "2024-02-09T12:00:00Z",
    updated_at: "2024-02-14T09:00:00Z"
  }
];

// Sample Reviews
export const sampleReviews: Review[] = [
  {
    review_id: 1,
    therapist_id: 1,
    user_id: 1,
    rating: 5,
    comment: "Dr. Johnson is amazing! She helped me work through my anxiety with such compassion and expertise. Highly recommend!",
    created_at: "2024-02-01T10:00:00Z"
  },
  {
    review_id: 2,
    therapist_id: 2,
    user_id: 2,
    rating: 4,
    comment: "Great experience with Dr. Chen. He really helped us improve our communication as a couple.",
    created_at: "2024-02-02T11:00:00Z"
  },
  {
    review_id: 3,
    therapist_id: 3,
    user_id: 3,
    rating: 5,
    comment: "Dr. Rodriguez is incredibly skilled. Her CBT techniques have been life-changing for my depression.",
    created_at: "2024-02-03T12:00:00Z"
  },
  {
    review_id: 4,
    therapist_id: 4,
    user_id: 4,
    rating: 4,
    comment: "Dr. Wilson has been instrumental in my recovery journey. His approach is both professional and caring.",
    created_at: "2024-02-04T13:00:00Z"
  },
  {
    review_id: 5,
    therapist_id: 1,
    user_id: 5,
    rating: 5,
    comment: "Excellent therapist! Dr. Johnson creates a safe space and provides practical tools for managing stress.",
    created_at: "2024-02-05T14:00:00Z"
  }
];

// Sample Availability Slots
export const sampleAvailabilitySlots: AvailabilitySlot[] = [
  {
    slot_id: 1,
    therapist_id: 1,
    day_of_week: 1, // Monday
    start_time: "09:00:00",
    end_time: "17:00:00",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    slot_id: 2,
    therapist_id: 1,
    day_of_week: 2, // Tuesday
    start_time: "10:00:00",
    end_time: "18:00:00",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    slot_id: 3,
    therapist_id: 2,
    day_of_week: 3, // Wednesday
    start_time: "14:00:00",
    end_time: "20:00:00",
    created_at: "2024-01-10T09:00:00Z"
  },
  {
    slot_id: 4,
    therapist_id: 3,
    day_of_week: 4, // Thursday
    start_time: "16:00:00",
    end_time: "21:00:00",
    created_at: "2024-01-12T11:00:00Z"
  },
  {
    slot_id: 5,
    therapist_id: 4,
    day_of_week: 5, // Friday
    start_time: "09:00:00",
    end_time: "16:00:00",
    created_at: "2024-01-08T08:00:00Z"
  }
];

// Sample Complaints
export const sampleComplaints: Complaint[] = [
  {
    complaint_id: 1,
    user_id: 1,
    therapist_id: 5,
    subject: "Late to session",
    description: "Therapist was 15 minutes late to our scheduled session without any prior notice.",
    status: "resolved",
    created_at: "2024-02-01T10:00:00Z",
    resolved_at: "2024-02-03T14:00:00Z"
  },
  {
    complaint_id: 2,
    user_id: 2,
    subject: "Platform technical issues",
    description: "Unable to access video call feature during my session. Had to reschedule.",
    status: "pending",
    created_at: "2024-02-05T11:00:00Z"
  },
  {
    complaint_id: 3,
    user_id: 3,
    therapist_id: 4,
    subject: "Inappropriate behavior",
    description: "Therapist made inappropriate comments during our session.",
    status: "pending",
    created_at: "2024-02-07T12:00:00Z"
  },
  {
    complaint_id: 4,
    user_id: 4,
    subject: "Billing dispute",
    description: "Charged for a session I had to cancel due to emergency.",
    status: "resolved",
    created_at: "2024-02-09T13:00:00Z",
    resolved_at: "2024-02-10T09:00:00Z"
  }
];

// Helper functions
export const getTherapistById = (id: number): Therapist | undefined => {
  return sampleTherapists.find(therapist => therapist.therapist_id === id);
};

export const getPatientById = (id: number): Patient | undefined => {
  return samplePatients.find(patient => patient.user_id === id);
};

export const getBookingsByTherapistId = (therapistId: number): Booking[] => {
  return sampleBookings.filter(booking => booking.therapist_id === therapistId);
};

export const getBookingsByPatientId = (patientId: number): Booking[] => {
  return sampleBookings.filter(booking => booking.user_id === patientId);
};

export const getReviewsByTherapistId = (therapistId: number): Review[] => {
  return sampleReviews.filter(review => review.therapist_id === therapistId);
};

export const getAvailabilityByTherapistId = (therapistId: number): AvailabilitySlot[] => {
  return sampleAvailabilitySlots.filter(slot => slot.therapist_id === therapistId);
};

export const getComplaintsByStatus = (status: "pending" | "resolved" | "dismissed"): Complaint[] => {
  return sampleComplaints.filter(complaint => complaint.status === status);
};

// Stats helpers
export const getTherapistStats = (therapistId: number) => {
  const bookings = getBookingsByTherapistId(therapistId);
  const reviews = getReviewsByTherapistId(therapistId);
  
  return {
    totalBookings: bookings.length,
    completedBookings: bookings.filter(b => b.status === "completed").length,
    pendingBookings: bookings.filter(b => b.status === "requested").length,
    averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    totalReviews: reviews.length
  };
};

export const getPatientStats = (patientId: number) => {
  const bookings = getBookingsByPatientId(patientId);
  
  return {
    totalSessions: bookings.filter(b => b.status === "completed").length,
    upcomingSessions: bookings.filter(b => b.status === "confirmed").length,
    totalSpent: bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + b.total_amount, 0)
  };
}; 