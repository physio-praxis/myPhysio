import { DATABASE_URL } from "$env/static/private";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";

export const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool);