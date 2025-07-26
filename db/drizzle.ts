import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

// config({ path: ".env" });

export const db = drizzle("postgresql://neondb_owner:npg_xsoBq9jlTVm7@ep-sparkling-grass-aed04rch-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
