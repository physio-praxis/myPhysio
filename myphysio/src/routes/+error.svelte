<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const errors404 = [
		{
			quote: 'Sitz, Platz... Seite? - Leider nicht gefunden.',
			image: '/images/error/404-1.jpg'
		},
		{
			quote: 'Wuff! Die Seite is wohl weggelaufen.',
			image: '/images/error/404-2.jpg'
		},
		{
			quote: 'Kein Stöckchen, keine Seite. Nur ein leerer Platz.',
			image: '/images/error/404-3.jpg'
		}
	];

	const errors500 = [
		{
			quote: 'Wuff... hier ist was schiefgelaufen. Unser Server hat wohl den Ball nicht gefangen.',
			image: '/images/error/500-1.jpg'
		},
		{
			quote:
				'Der Server liegt brav auf dem Rücken und wartet auf Streicheleinheiten. Bitte später nochmal versuchen',
			image: '/images/error/500-2.jpg'
		},
		{
			quote: 'Unser Server hat sich verlaufen. Vielleicht schnüffelt er gerade den Fehler aus.',
			image: '/images/error/500-3.jpg'
		}
	];

	const errorIs404 = page.status === 404;
	const array = errorIs404 ? errors404 : errors500;
	const index = Math.floor(Math.random() * array.length);

	let selectedError = $state(array[index]);
</script>

<main class="flex h-screen flex-col items-center justify-center p-4">
	<img
		src={selectedError.image}
		alt="Error illustration"
		class="mb-4 h-auto w-full max-w-md rounded-xl shadow-lg"
	/>
	<h2 class="mb-4 h2 font-bold text-primary-600-400">
		{page.status}
	</h2>
	<blockquote class="mb-4 blockquote text-xl font-medium text-surface-700">
		{selectedError.quote}
	</blockquote>

	{#if errorIs404}
		<a href={resolve('/app', {})} class="btn preset-filled-primary-500">Zurück zur Startseite</a>
	{:else}
		<a
			href="https://github.com/physio-praxis/myphysio/issues"
			target="_blank"
			rel="noopener noreferrer"
			class="btn preset-filled-primary-500"
		>
			Problem melden
		</a>
	{/if}
</main>
