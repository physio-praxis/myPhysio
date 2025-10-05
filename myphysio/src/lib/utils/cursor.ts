import { z } from 'zod';

const CursorPayloadSchema = z.object({
	id: z.coerce.number().int().positive(),
	createdAt: z.coerce.date()
});
export type CursorPayload = z.infer<typeof CursorPayloadSchema>;

export function encodeCursor(id: number, createdAt: Date) {
	return Buffer.from(
		JSON.stringify({ id: id, createdAt: createdAt.toISOString() }),
		'utf8'
	).toString('base64url');
}

export function decodeCursor(b64: string) {
	const raw = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
	const parsed = CursorPayloadSchema.parse(raw);
	return parsed;
}
