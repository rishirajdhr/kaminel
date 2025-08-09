import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;

declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: ReturnType<typeof postgres> | undefined;
}

// Reuse client across HMR in development to avoid exhausting connections
const sqlClient =
  global.__postgresClient ??
  postgres(connectionString, {
    ssl: "require",
    // With Supabase + PgBouncer, keep pool small per serverless instance
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global.__postgresClient = sqlClient;
}

export const db = drizzle(sqlClient, { schema });
