import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from '$lib/server/db/schema';

export async function makeTestDb() {
	const pg = new PGlite();
	const db = drizzle(pg, { schema });
	return { pg, db };
}
