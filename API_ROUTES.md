# Therapist Application API Routes

## 🔐 Authentication Routes

### Better Auth

- `GET/POST /api/auth/[...all]` - Better Auth handler for all authentication operations

## 🏢 Organization Management

### Organizations

- `GET /api/organizations` - List all organizations (Super Admin only)
- `POST /api/organizations` - Create new organization (Super Admin only)

### Organization Users

- `GET /api/org/[orgId]/users` - List users in organization (Admin only)
- `POST /api/org/[orgId]/users` - Create user or send invitation (Admin only)
- `PATCH /api/org/[orgId]/users/[userId]` - Update user status/role (Admin only)
- `DELETE /api/org/[orgId]/users/[userId]` - Remove user from organization (Admin only)

## 👨‍⚕️ Therapist Management

### Therapists

- `GET /api/org/[orgId]/therapists` - List therapists in organization
  - Query params: `?verification=pending|verified|rejected`
- `POST /api/org/[orgId]/therapists` - Create new therapist (Admin only)
- `GET /api/org/[orgId]/therapists/[therapistId]` - Get therapist details
- `PATCH /api/org/[orgId]/therapists/[therapistId]` - Update therapist profile

### Therapist Availability

- `GET /api/org/[orgId]/availability` - List availability slots
  - Query params: `?therapistId=xxx&date=yyyy-mm-dd`
- `POST /api/org/[orgId]/availability` - Create availability slot

## 🏥 Patient Management

### Patients

- `GET /api/org/[orgId]/patients` - List patients in organization
- `POST /api/org/[orgId]/patients` - Create new patient (Admin only)
- `GET /api/org/[orgId]/patients/[patientId]` - Get patient details
- `PATCH /api/org/[orgId]/patients/[patientId]` - Update patient profile

## 📅 Booking Management

### Bookings

- `GET /api/org/[orgId]/bookings` - List bookings
  - Query params: `?status=xxx&therapistId=xxx&patientId=xxx`
- `POST /api/org/[orgId]/bookings` - Create new booking
- `GET /api/org/[orgId]/bookings/[bookingId]` - Get booking details
- `PATCH /api/org/[orgId]/bookings/[bookingId]` - Update booking status
- `DELETE /api/org/[orgId]/bookings/[bookingId]` - Cancel booking

## ⭐ Review Management

### Reviews

- `GET /api/org/[orgId]/reviews` - List reviews
  - Query params: `?therapistId=xxx&patientId=xxx`
- `POST /api/org/[orgId]/reviews` - Create new review

## 🛡️ Authentication & Authorization

### Role Hierarchy

1. **Super Admin** - Full system access, can create organizations
2. **Admin** - Organization-level admin, manages users within org
3. **Therapist** - Can manage own profile, availability, and bookings
4. **Patient** - Can book therapists, leave reviews, manage own profile

### Access Control Examples

#### Organization Creation

```typescript
// Only Super Admins
POST / api / organizations;
Authorization: Bearer<super_admin_token>;
```

#### Create Therapist

```typescript
// Only Organization Admins
POST /api/org/123/therapists
Authorization: Bearer <admin_token>
{
  "email": "therapist@example.com",
  "name": "Dr. Smith",
  "password": "secure123",
  "qualification": "Licensed Clinical Psychologist",
  "hourlyRate": 120
}
```

#### Book Appointment

```typescript
// Patients can book for themselves, Admins for anyone
POST /api/org/123/bookings
Authorization: Bearer <patient_token>
{
  "therapistId": "therapist-uuid",
  "patientId": "patient-uuid",
  "startAt": "2024-01-15T10:00:00Z",
  "endAt": "2024-01-15T11:00:00Z",
  "hourlyRate": 120,
  "totalAmount": 120
}
```

#### Therapist Verification

```typescript
// Only Admins can verify therapists
PATCH /api/org/123/therapists/therapist-uuid
Authorization: Bearer <admin_token>
{
  "verification": "verified"
}
```

#### Leave Review

```typescript
// Patients can review therapists they've seen
POST /api/org/123/reviews
Authorization: Bearer <patient_token>
{
  "therapistId": "therapist-uuid",
  "patientId": "patient-uuid",
  "rating": 5,
  "comment": "Excellent session!"
}
```

## 📊 Data Models

### Organization

```typescript
{
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  metadata?: string; // JSON
  createdAt: Date;
}
```

### User (Better Auth)

```typescript
{
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "super_admin" | "admin" | "therapist" | "patient";
  isActive: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Therapist

```typescript
{
  id: string;
  userId: string; // Reference to User
  organizationId: string;
  email: string;
  name?: string;
  verification: "pending" | "verified" | "rejected";
  age?: number;
  gender?: "male" | "female" | "non_binary" | "other";
  profilePicture?: string;
  description?: string;
  qualification?: string;
  phoneNumber?: string;
  location?: string;
  hourlyRate?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Patient

```typescript
{
  id: string;
  userId: string; // Reference to User
  organizationId: string;
  userName?: string;
  phoneNumber?: string;
  gender?: "male" | "female" | "non_binary" | "other";
  age?: number;
  prefGender?: "male" | "female" | "non_binary" | "other";
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Booking

```typescript
{
  id: string;
  therapistId: string;
  patientId: string;
  slotId?: string; // Reference to availability slot
  startAt: Date;
  endAt: Date;
  status: "requested" | "confirmed" | "cancelled" | "completed";
  hourlyRate: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Review

```typescript
{
  id: string;
  therapistId: string;
  patientId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}
```

### Availability Slot

```typescript
{
  id: string;
  therapistId: string;
  dayOfWeek?: number; // 0-6 for recurring weekly slots
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  dateOverride?: Date; // For specific date availability
  createdAt: Date;
}
```

## 🚀 Getting Started

1. **Set up environment variables** for Better Auth
2. **Run database migrations** with `npx drizzle-kit migrate`
3. **Create your first super admin** manually in the database
4. **Create organizations** via API using super admin account
5. **Invite organization admins** to manage their practices
6. **Start onboarding therapists and patients**

## 🔄 Typical Workflow

1. **Super Admin** creates organizations for therapy practices
2. **Organization Admin** invites therapists and manages verification
3. **Therapists** set up profiles and availability schedules
4. **Patients** are onboarded and can browse verified therapists
5. **Patients** book appointments with preferred therapists
6. **Therapists** confirm/manage bookings and conduct sessions
7. **Patients** leave reviews after completed sessions
8. **Admins** monitor analytics and manage the practice

This API provides a complete foundation for a multi-tenant therapist booking and management system with proper role-based access control and organization isolation.
