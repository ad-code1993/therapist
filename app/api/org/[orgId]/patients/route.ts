import { NextRequest, NextResponse } from "next/server";
import { requireOrgPatient, requireOrgAdmin } from "@/lib/auth-middleware";
import { getOrganizationPatients, createPatientAsAdmin } from "@/lib/admin";

// GET /api/org/[orgId]/patients - List all patients in organization
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const authResult = await requireOrgPatient(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const patients = await getOrganizationPatients(params.orgId);

    // If user is a patient, only show their own data (unless admin/therapist)
    const isPatientRole = authResult.user.role === "patient";
    const filteredPatients = isPatientRole
      ? patients.filter((p) => p.patients?.userId === authResult.user.id)
      : patients;

    return NextResponse.json({ patients: filteredPatients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/patients - Create new patient
export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const authResult = await requireOrgAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const {
      email,
      name,
      password,
      userName,
      phoneNumber,
      gender,
      age,
      prefGender,
      description,
      isActive = true,
    } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    if (gender && !["male", "female", "non_binary", "other"].includes(gender)) {
      return NextResponse.json(
        { error: "Invalid gender value" },
        { status: 400 }
      );
    }

    if (
      prefGender &&
      !["male", "female", "non_binary", "other"].includes(prefGender)
    ) {
      return NextResponse.json(
        { error: "Invalid preferred gender value" },
        { status: 400 }
      );
    }

    const result = await createPatientAsAdmin({
      email,
      name,
      password,
      role: "patient",
      organizationId: params.orgId,
      isActive,
      userName,
      phoneNumber,
      gender,
      age,
      prefGender,
      description,
    });

    return NextResponse.json(
      {
        user: result.user,
        patient: result.patient,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}
