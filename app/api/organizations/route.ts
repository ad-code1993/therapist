import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-middleware";
import { db } from "@/db/drizzle";
import { organization } from "@/db/schema";
import { randomUUID } from "crypto";

// Retrieve all organizations (Super Admin only)
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (auth instanceof NextResponse) return auth; // Auth failure already handled

  const orgs = await db.select().from(organization);
  return NextResponse.json(orgs);
}

// Create a new organization (Super Admin only)
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => undefined);
  if (!body || typeof body.name !== "string" || body.name.trim() === "") {
    return NextResponse.json({ error: "`name` is required" }, { status: 400 });
  }

  const slug =
    (body.slug as string | undefined)?.toLowerCase() ??
    body.name.toLowerCase().replace(/\s+/g, "-");

  try {
    const [org] = await db
      .insert(organization)
      .values({
        id: randomUUID(),
        name: body.name.trim(),
        slug,
        logo: (body.logo as string | undefined) ?? null,
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      })
      .returning();

    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    console.error("Failed to create organization", error);
    return NextResponse.json(
      { error: "Unable to create organization" },
      { status: 500 }
    );
  }
}
