import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  account,
  session,
  user,
  verification,
  organization as orgTable,
  member,
  invitation,
} from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      organization: orgTable,
      member,
      invitation,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "patient",
        input: false, // don't allow user to set role during signup
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false, // admins control user activation
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword(data, request) {
      // TODO: Implement email sending logic
      console.log("Reset password email would be sent to:", data.user.email);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail(data, request) {
      // TODO: Implement email sending logic
      console.log("Verification email would be sent to:", data.user.email);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 1 week
    updateAge: 60 * 60 * 24, // 1 day
  },
  socialProviders: {
    // Add social providers if needed later
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: false, // Only super admins can create organizations
      organizationLimit: 5, // Limit per user
      sendInvitationEmail: async (data) => {
        // TODO: Implement invitation email sending
        console.log(
          "Organization invitation email would be sent to:",
          data.email
        );
      },
    }),
  ],
});

// Helper function to check if user has super admin role
export const isSuperAdmin = (user: any) => user?.role === "super_admin";

// Helper function to check if user has admin role
export const isAdmin = (user: any) => user?.role === "admin";

// Helper function to check if user has therapist role
export const isTherapist = (user: any) => user?.role === "therapist";

// Helper function to check if user has patient role
export const isPatient = (user: any) => user?.role === "patient";

// Helper function to check if user can access admin features
export const canAccessAdmin = (user: any) =>
  isSuperAdmin(user) || isAdmin(user);

// Helper function to check if user can access therapist features
export const canAccessTherapist = (user: any) =>
  isSuperAdmin(user) || isAdmin(user) || isTherapist(user);

// Helper function to check if user can access patient features
export const canAccessPatient = (user: any) =>
  isSuperAdmin(user) || isAdmin(user) || isPatient(user);

// Helper function to check organization permissions
export const hasOrgPermission = (user: any, permission: string) => {
  if (isSuperAdmin(user)) return true;
  return (
    user?.permissions?.includes(permission) || user?.permissions?.includes("*")
  );
};

export type Session = typeof auth.$Infer.Session;
