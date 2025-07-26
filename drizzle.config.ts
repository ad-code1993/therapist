import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_xsoBq9jlTVm7@ep-sparkling-grass-aed04rch-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});
