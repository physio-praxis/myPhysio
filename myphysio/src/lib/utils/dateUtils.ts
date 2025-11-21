export function formatDateDMY(value: string | number | Date, sep = '.') {
	const date = new Date(value);
	if (Number.isNaN(+date)) return '';

	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const yyyy = date.getFullYear();
	return `${dd}${sep}${mm}${sep}${yyyy}`;
}

export function fromDateOnly(dateStr: string) {
	console.log(dateStr);
	const [y, m, d] = dateStr.split('-').map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1); // no tz shift
}
