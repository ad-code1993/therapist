import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; 
import { nextCookies } from "better-auth/next-js";
// import { account, session, user, verification } from "@/db/schema";
 
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {
            
        }
    },
    database: drizzleAdapter(db, {
        provider: "pg", 
        // schema: {user, session, account, verification}
    }),
});