import { NextRequest, NextResponse } from "next/server";
import { requireOrgPatient } from "@/lib/auth-middleware";
import { db } from "@/db/drizzle";
import { reviews, therapists, patients } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/org/[orgId]/reviews - List reviews
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
    const therapistId = searchParams.get("therapistId");
    const patientId = searchParams.get("patientId");

    let query = db
      .select({
        review: reviews,
        therapist: therapists,
        patient: patients,
      })
      .from(reviews)
      .leftJoin(therapists, eq(reviews.therapistId, therapists.id))
      .leftJoin(patients, eq(reviews.patientId, patients.id));

    const conditions = [];

    // Filter by organization
    conditions.push(eq(therapists.organizationId, params.orgId));
    conditions.push(eq(patients.organizationId, params.orgId));

    // Role-based filtering
    if (authResult.user.role === "patient") {
      conditions.push(eq(patients.userId, authResult.user.id));
    } else if (authResult.user.role === "therapist") {
      conditions.push(eq(therapists.userId, authResult.user.id));
    }

    // Additional filters
    if (therapistId) {
      conditions.push(eq(reviews.therapistId, therapistId));
    }
    if (patientId) {
      conditions.push(eq(reviews.patientId, patientId));
    }

    const result = await query.where(and(...conditions));

    return NextResponse.json({ reviews: result });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/reviews - Create new review
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
    const { therapistId, patientId, rating, comment } = body;

    if (!therapistId || !patientId || !rating) {
      return NextResponse.json(
        { error: "Therapist ID, patient ID, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
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

    // Check if user has permission to create review for this patient
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isPatientUser = patient[0].userId === authResult.user.id;

    if (!isAdmin && !isPatientUser) {
      return NextResponse.json(
        { error: "Access denied: Can only create reviews for yourself" },
        { status: 403 }
      );
    }

    // Check if review already exists for this therapist-patient combination
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.therapistId, therapistId),
          eq(reviews.patientId, patientId)
        )
      );

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: "Review already exists for this therapist" },
        { status: 409 }
      );
    }

    const newReview = await db
      .insert(reviews)
      .values({
        id: crypto.randomUUID(),
        therapistId,
        patientId,
        rating,
        comment,
      })
      .returning();

    return NextResponse.json({ review: newReview[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
