import { NextRequest, NextResponse } from "next/server";
import { requireOrgAdmin, requireOrgTherapist } from "@/lib/auth-middleware";
import { getOrganizationTherapists, createTherapistAsAdmin } from "@/lib/admin";

// GET /api/org/[orgId]/therapists - List all therapists in organization
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
    const verificationStatus = searchParams.get("verification");

    const therapists = await getOrganizationTherapists(params.orgId);

    // Filter by verification status if provided
    let filteredTherapists = therapists;
    if (verificationStatus) {
      filteredTherapists = therapists.filter(
        (t) => t.therapists?.verification === verificationStatus
      );
    }

    return NextResponse.json({ therapists: filteredTherapists });
  } catch (error) {
    console.error("Error fetching therapists:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapists" },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/therapists - Create new therapist
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
      age,
      gender,
      profilePicture,
      description,
      qualification,
      phoneNumber,
      location,
      hourlyRate,
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

    const result = await createTherapistAsAdmin({
      email,
      name,
      password,
      role: "therapist",
      organizationId: params.orgId,
      isActive,
      age,
      gender,
      profilePicture,
      description,
      qualification,
      phoneNumber,
      location,
      hourlyRate,
    });

    return NextResponse.json(
      {
        user: result.user,
        therapist: result.therapist,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating therapist:", error);
    return NextResponse.json(
      { error: "Failed to create therapist" },
      { status: 500 }
    );
  }
}
