import type { Crumb } from '$lib/types/navigationTypes';

const defaultLabels: Record<string, string> = {
	customer: 'Kunde',
	add: 'Hinzufügen',
	edit: 'Bearbeiten',
	settings: 'Einstellungen',
	consent: 'Einwilligung'
};

export function generateBreadcrumbs(
	pathname: string,
	customLabels: Record<string, string> = {}
): Crumb[] {
	const pathWithoutApp = pathname.replace(/^\/app\/?/, '');
	// filter out empty segments
	const segments = pathWithoutApp.split('/').filter(Boolean);

	if (segments.length === 0) return [];

	const crumbs: Crumb[] = [];
	let currentPath = '/app';

	segments.forEach((segment) => {
		currentPath += `/${segment}`;

		const label =
			customLabels[segment] ||
			defaultLabels[segment] ||
			`${segment.charAt(0).toUpperCase()}${segment.slice(1)}`;
		crumbs.push({
			href: currentPath,
			label
		});
	});

	return crumbs;
}
