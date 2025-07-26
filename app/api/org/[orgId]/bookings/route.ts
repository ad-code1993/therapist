import { NextRequest, NextResponse } from "next/server";
import { requireOrgPatient } from "@/lib/auth-middleware";
import { db } from "@/db/drizzle";
import { bookings, therapists, patients } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";

// GET /api/org/[orgId]/bookings - List bookings
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const authResult = await requireOrgPatient(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const therapistId = searchParams.get("therapistId");
    const patientId = searchParams.get("patientId");

    let query = db
      .select({
        booking: bookings,
        therapist: therapists,
        patient: patients,
      })
      .from(bookings)
      .leftJoin(therapists, eq(bookings.therapistId, therapists.id))
      .leftJoin(patients, eq(bookings.patientId, patients.id));

    const conditions = [];

    // Filter by organization through therapist and patient
    conditions.push(eq(therapists.organizationId, params.orgId));
    conditions.push(eq(patients.organizationId, params.orgId));

    // Role-based filtering
    if (authResult.user.role === "patient") {
      conditions.push(eq(patients.userId, authResult.user.id));
    } else if (authResult.user.role === "therapist") {
      conditions.push(eq(therapists.userId, authResult.user.id));
    }

    // Additional filters
    if (status) {
      conditions.push(eq(bookings.status, status));
    }
    if (therapistId) {
      conditions.push(eq(bookings.therapistId, therapistId));
    }
    if (patientId) {
      conditions.push(eq(bookings.patientId, patientId));
    }

    const result = await query.where(and(...conditions));

    return NextResponse.json({ bookings: result });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/bookings - Create new booking
export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const authResult = await requireOrgPatient(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const {
      therapistId,
      patientId,
      startAt,
      endAt,
      slotId,
      hourlyRate,
      totalAmount,
    } = body;

    if (
      !therapistId ||
      !patientId ||
      !startAt ||
      !endAt ||
      !hourlyRate ||
      !totalAmount
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify therapist belongs to organization
    const therapist = await db
      .select()
      .from(therapists)
      .where(
        and(
          eq(therapists.id, therapistId),
          eq(therapists.organizationId, params.orgId)
        )
      );

    if (therapist.length === 0) {
      return NextResponse.json(
        { error: "Therapist not found in organization" },
        { status: 404 }
      );
    }

    // Verify patient belongs to organization
    const patient = await db
      .select()
      .from(patients)
      .where(
        and(
          eq(patients.id, patientId),
          eq(patients.organizationId, params.orgId)
        )
      );

    if (patient.length === 0) {
      return NextResponse.json(
        { error: "Patient not found in organization" },
        { status: 404 }
      );
    }

    // Check if user has permission to create booking for this patient
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isPatientUser = patient[0].userId === authResult.user.id;

    if (!isAdmin && !isPatientUser) {
      return NextResponse.json(
        { error: "Access denied: Can only create bookings for yourself" },
        { status: 403 }
      );
    }

    // Check for scheduling conflicts
    const startTime = new Date(startAt);
    const endTime = new Date(endAt);

    const conflictingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.therapistId, therapistId),
          or(
            eq(bookings.status, "confirmed"),
            eq(bookings.status, "requested")
          ),
          or(
            and(eq(bookings.startAt, startTime), eq(bookings.endAt, endTime))
            // Add more complex overlap checking here if needed
          )
        )
      );

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: "Time slot is already booked" },
        { status: 409 }
      );
    }

    const newBooking = await db
      .insert(bookings)
      .values({
        id: crypto.randomUUID(),
        therapistId,
        patientId,
        startAt: startTime,
        endAt: endTime,
        slotId,
        hourlyRate: hourlyRate.toString(),
        totalAmount: totalAmount.toString(),
        status: "requested",
      })
      .returning();

    return NextResponse.json({ booking: newBooking[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
