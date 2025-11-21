export function toStringMap(formData: FormData): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [key, value] of formData.entries()) {
		out[key] = typeof value === 'string' ? value : value.name;
	}
	return out;
}
