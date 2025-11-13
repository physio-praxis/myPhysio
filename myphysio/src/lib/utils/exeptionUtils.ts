import type { PostgresError } from '$lib/types/exceptionTypes';

export function isDatabaseError(error: unknown): error is PostgresError {
	return typeof error === 'object' && error !== null && 'code' in error;
}

export function isUniqueViolation(error: unknown): boolean {
	return isDatabaseError(error) && error.code === '23505';
}

export function getErrorConstraint(error: unknown): string | undefined {
	return isDatabaseError(error) ? error.constraint : undefined;
}
