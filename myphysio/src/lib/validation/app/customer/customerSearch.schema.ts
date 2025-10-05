import { z } from 'zod';

export const customerSearchQuerySchema = z.object({
	query: z.string().trim().max(256, 'query too long').optional().default(''),
	limit: z.coerce
		.number()
		.min(1, 'limit must be 1..100')
		.max(100, 'limit must be 1..100')
		.optional()
		.default(20),
	cursor: z.string().optional()
});

export type CustomerSearchQuery = z.infer<typeof customerSearchQuerySchema>;
