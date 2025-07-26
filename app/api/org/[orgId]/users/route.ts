import { NextRequest, NextResponse } from "next/server";
import { requireOrgAdmin } from "@/lib/auth-middleware";
import {
  getOrganizationUsers,
  createUserAsAdmin,
  inviteUserToOrganization,
} from "@/lib/admin";

// GET /api/org/[orgId]/users - List all users in organization
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const authResult = await requireOrgAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const users = await getOrganizationUsers(params.orgId);
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching organization users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/users - Create new user or send invitation
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
      role,
      isActive = true,
      sendInvitation = false,
    } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!["admin", "therapist", "patient"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin, therapist, or patient" },
        { status: 400 }
      );
    }

    // If sendInvitation is true, create invitation instead of user
    if (sendInvitation) {
      const invitation = await inviteUserToOrganization(
        params.orgId,
        email,
        role,
        authResult.user.id
      );

      return NextResponse.json({ invitation }, { status: 201 });
    }

    // Create user directly
    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required when creating user directly" },
        { status: 400 }
      );
    }

    const user = await createUserAsAdmin({
      email,
      name,
      password,
      role,
      organizationId: params.orgId,
      isActive,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
