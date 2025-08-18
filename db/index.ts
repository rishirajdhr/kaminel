import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({ path: ".env.local" });

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const url = process.env.DATABASE_URL!;
const client = postgres(url);
const db = globalThis.__drizzleDb ?? drizzle({ client, schema });

if (process.env.NODE_ENV !== "production") {
  // Persist DB singleton across HMR to prevent connection leaks
  globalThis.__drizzleDb = db;
}

export { client, db };
