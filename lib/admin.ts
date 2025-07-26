import { db } from "@/db/drizzle";
import {
  user,
  therapists,
  patients,
  organization,
  member,
  invitation,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "./auth";

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role: "admin" | "therapist" | "patient";
  organizationId: string;
  isActive?: boolean;
}

export interface CreateTherapistData extends CreateUserData {
  role: "therapist";
  age?: number;
  gender?: "male" | "female" | "non_binary" | "other";
  profilePicture?: string;
  description?: string;
  qualification?: string;
  phoneNumber?: string;
  location?: string;
  hourlyRate?: number;
}

export interface CreatePatientData extends CreateUserData {
  role: "patient";
  userName?: string;
  phoneNumber?: string;
  gender?: "male" | "female" | "non_binary" | "other";
  age?: number;
  prefGender?: "male" | "female" | "non_binary" | "other";
  description?: string;
}

export interface CreateOrganizationData {
  name: string;
  slug?: string;
  logo?: string;
  metadata?: string;
}

// Super Admin function to create a new organization
export async function createOrganization(orgData: CreateOrganizationData) {
  try {
    const newOrg = await db
      .insert(organization)
      .values({
        id: crypto.randomUUID(),
        name: orgData.name,
        slug: orgData.slug || orgData.name.toLowerCase().replace(/\s+/g, "-"),
        logo: orgData.logo,
        metadata: orgData.metadata,
      })
      .returning();

    return newOrg[0];
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
}

// Admin function to create a new user with role within an organization
export async function createUserAsAdmin(userData: CreateUserData) {
  try {
    // Create user account using Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
      },
    });

    if (result.data?.user) {
      // Update the user with admin-specific fields
      await db
        .update(user)
        .set({
          role: userData.role,
          isActive: userData.isActive ?? true,
        })
        .where(eq(user.id, result.data.user.id));

      // Add user to organization as member
      await db.insert(member).values({
        id: crypto.randomUUID(),
        organizationId: userData.organizationId,
        userId: result.data.user.id,
        role: userData.role,
      });

      return result.data.user;
    }
    throw new Error("Failed to create user");
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Admin function to create a therapist within an organization
export async function createTherapistAsAdmin(
  therapistData: CreateTherapistData
) {
  try {
    // First create the user
    const newUser = await createUserAsAdmin(therapistData);

    // Then create the therapist profile
    const therapistProfile = await db
      .insert(therapists)
      .values({
        id: crypto.randomUUID(),
        userId: newUser.id,
        organizationId: therapistData.organizationId,
        email: therapistData.email,
        name: therapistData.name,
        age: therapistData.age,
        gender: therapistData.gender,
        profilePicture: therapistData.profilePicture,
        description: therapistData.description,
        qualification: therapistData.qualification,
        phoneNumber: therapistData.phoneNumber,
        location: therapistData.location,
        hourlyRate: therapistData.hourlyRate?.toString(),
      })
      .returning();

    return { user: newUser, therapist: therapistProfile[0] };
  } catch (error) {
    console.error("Error creating therapist:", error);
    throw error;
  }
}

// Admin function to create a patient within an organization
export async function createPatientAsAdmin(patientData: CreatePatientData) {
  try {
    // First create the user
    const newUser = await createUserAsAdmin(patientData);

    // Then create the patient profile
    const patientProfile = await db
      .insert(patients)
      .values({
        id: crypto.randomUUID(),
        userId: newUser.id,
        organizationId: patientData.organizationId,
        userName: patientData.userName,
        phoneNumber: patientData.phoneNumber,
        gender: patientData.gender,
        age: patientData.age,
        prefGender: patientData.prefGender,
        description: patientData.description,
      })
      .returning();

    return { user: newUser, patient: patientProfile[0] };
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
}

// Admin function to get all users within an organization
export async function getOrganizationUsers(organizationId: string) {
  try {
    return await db
      .select()
      .from(member)
      .leftJoin(user, eq(member.userId, user.id))
      .where(eq(member.organizationId, organizationId));
  } catch (error) {
    console.error("Error fetching organization users:", error);
    throw error;
  }
}

// Admin function to get all therapists within an organization
export async function getOrganizationTherapists(organizationId: string) {
  try {
    return await db
      .select()
      .from(therapists)
      .leftJoin(user, eq(therapists.userId, user.id))
      .where(eq(therapists.organizationId, organizationId));
  } catch (error) {
    console.error("Error fetching organization therapists:", error);
    throw error;
  }
}

// Admin function to get all patients within an organization
export async function getOrganizationPatients(organizationId: string) {
  try {
    return await db
      .select()
      .from(patients)
      .leftJoin(user, eq(patients.userId, user.id))
      .where(eq(patients.organizationId, organizationId));
  } catch (error) {
    console.error("Error fetching organization patients:", error);
    throw error;
  }
}

// Super Admin function to get all organizations
export async function getAllOrganizations() {
  try {
    return await db.select().from(organization);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
}

// Admin function to invite user to organization
export async function inviteUserToOrganization(
  organizationId: string,
  email: string,
  role: "admin" | "therapist" | "patient",
  inviterId: string
) {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const newInvitation = await db
      .insert(invitation)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        email,
        role,
        expiresAt,
        inviterId,
      })
      .returning();

    return newInvitation[0];
  } catch (error) {
    console.error("Error creating invitation:", error);
    throw error;
  }
}

// Admin function to update user status within organization
export async function updateOrganizationUserStatus(
  organizationId: string,
  userId: string,
  isActive: boolean
) {
  try {
    // Check if user belongs to the organization
    const memberExists = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.organizationId, organizationId),
          eq(member.userId, userId)
        )
      );

    if (memberExists.length === 0) {
      throw new Error("User is not a member of this organization");
    }

    return await db
      .update(user)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(user.id, userId))
      .returning();
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}

// Admin function to update user role within organization
export async function updateOrganizationUserRole(
  organizationId: string,
  userId: string,
  role: "admin" | "therapist" | "patient"
) {
  try {
    // Update user role in the main user table
    await db
      .update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.id, userId));

    // Update member role in the organization
    return await db
      .update(member)
      .set({ role })
      .where(
        and(
          eq(member.organizationId, organizationId),
          eq(member.userId, userId)
        )
      )
      .returning();
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

// Admin function to remove user from organization
export async function removeUserFromOrganization(
  organizationId: string,
  userId: string
) {
  try {
    return await db
      .delete(member)
      .where(
        and(
          eq(member.organizationId, organizationId),
          eq(member.userId, userId)
        )
      )
      .returning();
  } catch (error) {
    console.error("Error removing user from organization:", error);
    throw error;
  }
}

// Admin function to verify therapist within organization
export async function verifyOrganizationTherapist(
  organizationId: string,
  therapistId: string,
  status: "pending" | "verified" | "rejected"
) {
  try {
    return await db
      .update(therapists)
      .set({ verification: status, updatedAt: new Date() })
      .where(
        and(
          eq(therapists.id, therapistId),
          eq(therapists.organizationId, organizationId)
        )
      )
      .returning();
  } catch (error) {
    console.error("Error verifying therapist:", error);
    throw error;
  }
}
