import { NextRequest, NextResponse } from "next/server";
import { requireOrgAdmin } from "@/lib/auth-middleware";
import {
  updateOrganizationUserStatus,
  updateOrganizationUserRole,
  removeUserFromOrganization,
} from "@/lib/admin";

// PATCH /api/org/[orgId]/users/[userId] - Update user status or role
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string; userId: string } }
) {
  const authResult = await requireOrgAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { isActive, role } = body;

    let result;

    // Update user status
    if (typeof isActive === "boolean") {
      result = await updateOrganizationUserStatus(
        params.orgId,
        params.userId,
        isActive
      );
    }

    // Update user role
    if (role) {
      if (!["admin", "therapist", "patient"].includes(role)) {
        return NextResponse.json(
          { error: "Invalid role. Must be admin, therapist, or patient" },
          { status: 400 }
        );
      }

      result = await updateOrganizationUserRole(
        params.orgId,
        params.userId,
        role
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: "No valid updates provided" },
        { status: 400 }
      );
    }

    return NextResponse.json({ user: result[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/org/[orgId]/users/[userId] - Remove user from organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orgId: string; userId: string } }
) {
  const authResult = await requireOrgAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    // Prevent users from removing themselves
    if (authResult.user.id === params.userId) {
      return NextResponse.json(
        { error: "Cannot remove yourself from organization" },
        { status: 400 }
      );
    }

    const result = await removeUserFromOrganization(
      params.orgId,
      params.userId
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: "User not found in organization" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User removed from organization successfully",
    });
  } catch (error) {
    console.error("Error removing user:", error);
    return NextResponse.json(
      { error: "Failed to remove user" },
      { status: 500 }
    );
  }
}
