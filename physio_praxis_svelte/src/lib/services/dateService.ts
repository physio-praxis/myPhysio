export function formatDateToGerman(dateString: string | null) {
	if (dateString === null) return '-';
	const date = new Date(dateString);

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	};

	return date.toLocaleDateString('de-DE', options);
}
