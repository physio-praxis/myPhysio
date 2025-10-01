import { afterAll, beforeAll } from 'vitest';
import { makeTestDb } from './testDb';
import { PGlite } from '@electric-sql/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

type TestDb = Awaited<ReturnType<typeof makeTestDb>>;
export const testScaffold: { db: TestDb['db']; pg: PGlite | null } = {
	db: null as unknown as TestDb['db'],
	pg: null
};

beforeAll(async () => {
	const { pg, db } = await makeTestDb();
	testScaffold.db = db;
	testScaffold.pg = pg;

	await migrate(db, { migrationsFolder: 'drizzle' });
});

afterAll(async () => {
	await testScaffold.pg?.close?.();
});
