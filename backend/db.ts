import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/jobmatcher",
});

export async function query<T = any>(text: string, params: any[] = []) {
  return pool.query<T>(text, params);
}
