import { readFileSync } from 'fs';
import type { PageServerLoad } from './$types';
import { join } from 'path';

export const load: PageServerLoad = async () => {
	const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

	return {
		version: packageJson.version
	};
};
