import { afterAll, beforeAll } from "vitest";
import { makeTestDb } from "./testDb";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from 'drizzle-orm/pglite/migrator'; 

export const testScaffold = {
    db: null as any,
    pg: null as any
};

beforeAll(async () => {
    const { pg, db } = await makeTestDb();
    testScaffold.db = db;
    testScaffold.pg = pg;

    await migrate(db, { migrationsFolder: 'drizzle' });
});

afterAll(async () => {
    const pg: PGlite | null = testScaffold.pg as PGlite;
    await pg?.close?.();
});