import { NextRequest, NextResponse } from "next/server";
import { requireOrgPatient } from "@/lib/auth-middleware";
import { db } from "@/db/drizzle";
import { patients } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/org/[orgId]/patients/[patientId] - Get patient details
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string; patientId: string } }
) {
  const authResult = await requireOrgPatient(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    // Check access permissions
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isTherapist = authResult.user.role === "therapist";
    const isOwnProfile = authResult.user.id === params.patientId;

    if (!isAdmin && !isTherapist && !isOwnProfile) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const patient = await db
      .select()
      .from(patients)
      .where(
        and(
          eq(patients.id, params.patientId),
          eq(patients.organizationId, params.orgId)
        )
      );

    if (patient.length === 0) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ patient: patient[0] });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}

// PATCH /api/org/[orgId]/patients/[patientId] - Update patient
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string; patientId: string } }
) {
  const authResult = await requireOrgPatient(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const {
      userName,
      phoneNumber,
      gender,
      age,
      prefGender,
      description
    } = body;

    // Check access permissions
    const isAdmin = ["admin", "super_admin"].includes(authResult.user.role);
    const isOwnProfile = authResult.user.id === params.patientId;

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { error: "Access denied: Can only update your own profile" },
        { status: 403 }
      );
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (userName !== undefined) updateData.userName = userName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (gender !== undefined) {
      if (!["male", "female", "non_binary", "other"].includes(gender)) {
        return NextResponse.json(
          { error: "Invalid gender value" },
          { status: 400 }
        );
      }
      updateData.gender = gender;
    }
    if (age !== undefined) updateData.age = age;
    if (prefGender !== undefined) {
      if (!["male", "female", "non_binary", "other"].includes(prefGender)) {
        return NextResponse.json(
          { error: "Invalid preferred gender value" },
          { status: 400 }
        );
      }
      updateData.prefGender = prefGender;
    }
    if (description !== undefined) updateData.description = description;

    const result = await db
      .update(patients)
      .set(updateData)
      .where(
        and(
          eq(patients.id, params.patientId),
          eq(patients.organizationId, params.orgId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ patient: result[0] });
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
} 