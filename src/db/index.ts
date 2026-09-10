import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// Deteksi Supabase / kebutuhan SSL:
// Supabase & Neon menggunakan SSL dengan certificate chain yang tidak selalu
// valid di Node.js default, jadi kita perlu rejectUnauthorized: false
// (koneksi tetap terenkripsi via TLS, hanya cert verification yang dilonggarkan)
const needsSSL =
  databaseUrl.includes("supabase.co") ||
  /sslmode=require|sslmode=verify-full/i.test(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
    // Maksimum koneksi reasonable untuk serverless (Vercel)
    max: process.env.NODE_ENV === "production" ? 5 : 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
