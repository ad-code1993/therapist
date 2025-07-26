import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { db } from "@/db/drizzle";
import { member, organization } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export interface AuthContext {
  user: any;
  session: any;
  organizationId?: string;
  organizationRole?: string;
}

// Middleware to check if user is authenticated
export async function requireAuth(
  request: NextRequest
): Promise<AuthContext | NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.isActive) {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
      );
    }

    return {
      user: session.user,
      session: session.session,
    };
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

// Middleware to check super admin role
export async function requireSuperAdmin(
  request: NextRequest
): Promise<AuthContext | NextResponse> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (authResult.user.role !== "super_admin") {
    return NextResponse.json(
      { error: "Super admin access required" },
      { status: 403 }
    );
  }

  return authResult;
}

// Middleware to check admin role (org admin or super admin)
export async function requireAdmin(
  request: NextRequest
): Promise<AuthContext | NextResponse> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!["admin", "super_admin"].includes(authResult.user.role)) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  return authResult;
}

// Middleware to check organization membership and role
export async function requireOrganizationAccess(
  request: NextRequest,
  organizationId: string,
  requiredRoles?: string[]
): Promise<AuthContext | NextResponse> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Super admins have access to all organizations
  if (authResult.user.role === "super_admin") {
    return {
      ...authResult,
      organizationId,
      organizationRole: "super_admin",
    };
  }

  try {
    // Check if user is a member of the organization
    const membership = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.organizationId, organizationId),
          eq(member.userId, authResult.user.id)
        )
      );

    if (membership.length === 0) {
      return NextResponse.json(
        { error: "Access denied: Not a member of this organization" },
        { status: 403 }
      );
    }

    const userOrgRole = membership[0].role;

    // Check if user has required role
    if (requiredRoles && !requiredRoles.includes(userOrgRole)) {
      return NextResponse.json(
        {
          error: `Access denied: Required role(s): ${requiredRoles.join(", ")}`,
        },
        { status: 403 }
      );
    }

    return {
      ...authResult,
      organizationId,
      organizationRole: userOrgRole,
    };
  } catch (error) {
    console.error("Organization access check error:", error);
    return NextResponse.json(
      { error: "Failed to verify organization access" },
      { status: 500 }
    );
  }
}

// Middleware for therapist-specific routes
export async function requireTherapist(
  request: NextRequest
): Promise<AuthContext | NextResponse> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!["therapist", "admin", "super_admin"].includes(authResult.user.role)) {
    return NextResponse.json(
      { error: "Therapist access required" },
      { status: 403 }
    );
  }

  return authResult;
}

// Middleware for patient-specific routes
export async function requirePatient(
  request: NextRequest
): Promise<AuthContext | NextResponse> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!["patient", "admin", "super_admin"].includes(authResult.user.role)) {
    return NextResponse.json(
      { error: "Patient access required" },
      { status: 403 }
    );
  }

  return authResult;
}

// Helper function to extract organization ID from request
export function getOrganizationIdFromRequest(
  request: NextRequest
): string | null {
  const url = new URL(request.url);

  // Try to get from URL params (e.g., /api/org/[orgId]/...)
  const pathSegments = url.pathname.split("/");
  const orgIndex = pathSegments.indexOf("org");
  if (orgIndex !== -1 && pathSegments[orgIndex + 1]) {
    return pathSegments[orgIndex + 1];
  }

  // Try to get from query params
  return url.searchParams.get("organizationId");
}

// Higher-order function to create organization-specific middleware
export function createOrgMiddleware(requiredRoles?: string[]) {
  return async (request: NextRequest): Promise<AuthContext | NextResponse> => {
    const organizationId = getOrganizationIdFromRequest(request);

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    return requireOrganizationAccess(request, organizationId, requiredRoles);
  };
}

// Specific middleware combinations
export const requireOrgAdmin = createOrgMiddleware(["admin", "super_admin"]);
export const requireOrgTherapist = createOrgMiddleware([
  "therapist",
  "admin",
  "super_admin",
]);
export const requireOrgPatient = createOrgMiddleware([
  "patient",
  "therapist",
  "admin",
  "super_admin",
]);
