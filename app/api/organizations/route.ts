import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin, requireAuth } from "@/lib/auth-middleware";
import { createOrganization, getAllOrganizations } from "@/lib/admin";

// GET /api/organizations - List all organizations (Super Admin only)
export async function GET(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const organizations = await getAllOrganizations();
    return NextResponse.json({ organizations });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}

// POST /api/organizations - Create new organization (Super Admin only)
export async function POST(request: NextRequest) {
  const authResult = await requireSuperAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { name, slug, logo, metadata } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    const organization = await createOrganization({
      name,
      slug,
      logo,
      metadata,
    });

    return NextResponse.json({ organization }, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 }
    );
  }
}
