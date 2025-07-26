import { db } from "@/db/drizzle";
import { user } from "@/db/schema";

async function createSuperAdmin() {
  try {
    const email = "superadmin@therapy.com";
    const password = "SuperAdmin123!";
    const name = "Super Administrator";

    // Create the super admin user directly
    const newUser = await db
      .insert(user)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        emailVerified: true, // Skip email verification for super admin
        role: "super_admin",
        isActive: true,
      })
      .returning();

    console.log("✅ Super admin created successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("👤 User ID:", newUser[0].id);
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");

    return newUser[0];
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
    throw error;
  }
}

// Run the script
createSuperAdmin()
  .then(() => {
    console.log("🎉 Setup complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Setup failed:", error);
    process.exit(1);
  });
