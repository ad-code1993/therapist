import { NextRequest, NextResponse } from "next/server";
import { requireOrgPatient } from "@/lib/auth-middleware";
import { db } from "@/db/drizzle";
import { bookings, therapists, patients } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/org/[orgId]/bookings/[bookingId] - Get booking details
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string; bookingId: string } }
) {
  const authResult = await requireOrgPatient(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const booking = await db
      .select({
        booking: bookings,
        therapist: therapists,
        patient: patients,
      })
      .from(bookings)
      .leftJoin(therapists, eq(bookings.therapistId, therapists.id))
      .leftJoin(patients, eq(bookings.patientId, patients.id))
      .where(
        and(
          eq(bookings.id, params.bookingId),
          eq(therapists.organizationId, params.orgId),
          eq(patients.organizationId, params.orgId)
        )
      );

    if (booking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Check access permissions
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isTherapist = bookingData.therapist?.userId === authResult.user.id;
    const isPatient = bookingData.patient?.userId === authResult.user.id;

    if (!isAdmin && !isTherapist && !isPatient) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking: bookingData });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/org/[orgId]/bookings/[bookingId] - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string; bookingId: string } }
) {
  const authResult = await requireOrgPatient(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    if (!["requested", "confirmed", "cancelled", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Get booking with related data to check permissions
    const bookingData = await db
      .select({
        booking: bookings,
        therapist: therapists,
        patient: patients,
      })
      .from(bookings)
      .leftJoin(therapists, eq(bookings.therapistId, therapists.id))
      .leftJoin(patients, eq(bookings.patientId, patients.id))
      .where(
        and(
          eq(bookings.id, params.bookingId),
          eq(therapists.organizationId, params.orgId),
          eq(patients.organizationId, params.orgId)
        )
      );

    if (bookingData.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = bookingData[0];
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isTherapist = booking.therapist?.userId === authResult.user.id;
    const isPatient = booking.patient?.userId === authResult.user.id;

    // Check permissions based on status change
    if (status === "confirmed") {
      // Only therapists and admins can confirm bookings
      if (!isAdmin && !isTherapist) {
        return NextResponse.json(
          { error: "Only therapists can confirm bookings" },
          { status: 403 }
        );
      }
    } else if (status === "cancelled") {
      // Patients can cancel their own bookings, therapists can cancel any booking
      if (!isAdmin && !isTherapist && !isPatient) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
    } else if (status === "completed") {
      // Only therapists and admins can mark as completed
      if (!isAdmin && !isTherapist) {
        return NextResponse.json(
          { error: "Only therapists can mark bookings as completed" },
          { status: 403 }
        );
      }
    }

    const result = await db
      .update(bookings)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(bookings.id, params.bookingId))
      .returning();

    return NextResponse.json({ booking: result[0] });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/org/[orgId]/bookings/[bookingId] - Cancel/Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orgId: string; bookingId: string } }
) {
  const authResult = await requireOrgPatient(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    // Get booking to check permissions
    const bookingData = await db
      .select({
        booking: bookings,
        therapist: therapists,
        patient: patients,
      })
      .from(bookings)
      .leftJoin(therapists, eq(bookings.therapistId, therapists.id))
      .leftJoin(patients, eq(bookings.patientId, patients.id))
      .where(
        and(
          eq(bookings.id, params.bookingId),
          eq(therapists.organizationId, params.orgId),
          eq(patients.organizationId, params.orgId)
        )
      );

    if (bookingData.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = bookingData[0];
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isTherapist = booking.therapist?.userId === authResult.user.id;
    const isPatient = booking.patient?.userId === authResult.user.id;

    if (!isAdmin && !isTherapist && !isPatient) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Update status to cancelled instead of hard delete
    const result = await db
      .update(bookings)
      .set({ 
        status: "cancelled",
        updatedAt: new Date()
      })
      .where(eq(bookings.id, params.bookingId))
      .returning();

    return NextResponse.json({ 
      message: "Booking cancelled successfully",
      booking: result[0]
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
} 