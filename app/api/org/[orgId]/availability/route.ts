import { NextRequest, NextResponse } from "next/server";
import { requireOrgTherapist } from "@/lib/auth-middleware";
import { db } from "@/db/drizzle";
import { availabilitySlots, therapists } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/org/[orgId]/availability - List availability slots
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const authResult = await requireOrgTherapist(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get("therapistId");
    const date = searchParams.get("date");

    let query = db
      .select({
        slot: availabilitySlots,
        therapist: therapists,
      })
      .from(availabilitySlots)
      .leftJoin(therapists, eq(availabilitySlots.therapistId, therapists.id));

    const conditions = [];

    // Filter by organization
    conditions.push(eq(therapists.organizationId, params.orgId));

    // Role-based filtering
    if (authResult.user.role === "therapist") {
      conditions.push(eq(therapists.userId, authResult.user.id));
    }

    // Additional filters
    if (therapistId) {
      conditions.push(eq(availabilitySlots.therapistId, therapistId));
    }
    if (date) {
      conditions.push(eq(availabilitySlots.dateOverride, new Date(date)));
    }

    const result = await query.where(and(...conditions));

    return NextResponse.json({ availability: result });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/availability - Create availability slot
export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const authResult = await requireOrgTherapist(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { therapistId, dayOfWeek, startTime, endTime, dateOverride } = body;

    if (
      !therapistId ||
      (!dayOfWeek && !dateOverride) ||
      !startTime ||
      !endTime
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

    // Check if user has permission to create availability for this therapist
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isTherapistUser = therapist[0].userId === authResult.user.id;

    if (!isAdmin && !isTherapistUser) {
      return NextResponse.json(
        { error: "Access denied: Can only manage your own availability" },
        { status: 403 }
      );
    }

    // Validate day of week if provided
    if (dayOfWeek !== undefined && (dayOfWeek < 0 || dayOfWeek > 6)) {
      return NextResponse.json(
        { error: "Day of week must be between 0 (Sunday) and 6 (Saturday)" },
        { status: 400 }
      );
    }

    const newSlot = await db
      .insert(availabilitySlots)
      .values({
        id: crypto.randomUUID(),
        therapistId,
        dayOfWeek,
        startTime,
        endTime,
        dateOverride: dateOverride ? new Date(dateOverride) : null,
      })
      .returning();

    return NextResponse.json({ slot: newSlot[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating availability slot:", error);
    return NextResponse.json(
      { error: "Failed to create availability slot" },
      { status: 500 }
    );
  }
}
