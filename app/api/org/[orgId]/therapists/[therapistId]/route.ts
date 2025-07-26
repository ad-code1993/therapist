import { NextRequest, NextResponse } from "next/server";
import { requireOrgAdmin, requireOrgTherapist } from "@/lib/auth-middleware";
import { verifyOrganizationTherapist } from "@/lib/admin";
import { db } from "@/db/drizzle";
import { therapists } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/org/[orgId]/therapists/[therapistId] - Get therapist details
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string; therapistId: string } }
) {
  const authResult = await requireOrgTherapist(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const therapist = await db
      .select()
      .from(therapists)
      .where(
        and(
          eq(therapists.id, params.therapistId),
          eq(therapists.organizationId, params.orgId)
        )
      );

    if (therapist.length === 0) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ therapist: therapist[0] });
  } catch (error) {
    console.error("Error fetching therapist:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapist" },
      { status: 500 }
    );
  }
}

// PATCH /api/org/[orgId]/therapists/[therapistId] - Update therapist
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string; therapistId: string } }
) {
  const authResult = await requireOrgTherapist(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const {
      name,
      age,
      gender,
      profilePicture,
      description,
      qualification,
      phoneNumber,
      location,
      hourlyRate,
      verification,
    } = body;

    // Check if user is admin or the therapist themselves
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isOwnProfile = authResult.user.id === params.therapistId;

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { error: "Access denied: Can only update your own profile" },
        { status: 403 }
      );
    }

    // Only admins can update verification status
    if (verification && !isAdmin) {
      return NextResponse.json(
        { error: "Access denied: Only admins can update verification status" },
        { status: 403 }
      );
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) {
      if (!["male", "female", "non_binary", "other"].includes(gender)) {
        return NextResponse.json(
          { error: "Invalid gender value" },
          { status: 400 }
        );
      }
      updateData.gender = gender;
    }
    if (profilePicture !== undefined)
      updateData.profilePicture = profilePicture;
    if (description !== undefined) updateData.description = description;
    if (qualification !== undefined) updateData.qualification = qualification;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (location !== undefined) updateData.location = location;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate.toString();

    // Handle verification separately if admin
    if (verification && isAdmin) {
      if (!["pending", "verified", "rejected"].includes(verification)) {
        return NextResponse.json(
          { error: "Invalid verification status" },
          { status: 400 }
        );
      }

      const result = await verifyOrganizationTherapist(
        params.orgId,
        params.therapistId,
        verification
      );

      return NextResponse.json({ therapist: result[0] });
    }

    // Update other fields
    const result = await db
      .update(therapists)
      .set(updateData)
      .where(
        and(
          eq(therapists.id, params.therapistId),
          eq(therapists.organizationId, params.orgId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ therapist: result[0] });
  } catch (error) {
    console.error("Error updating therapist:", error);
    return NextResponse.json(
      { error: "Failed to update therapist" },
      { status: 500 }
    );
  }
}
