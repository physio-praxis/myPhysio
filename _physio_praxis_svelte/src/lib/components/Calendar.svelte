<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/themes/dark.css';
	import flatpickr from 'flatpickr';
	import { German } from 'flatpickr/dist/l10n/de.js';

	const options = {
		enableTime: false,
		dateFormat: 'd-m-Y',
		defaultDate: new Date(),
		maxDate: new Date()
	};

	export let selected: Date | null | undefined;

	flatpickr.localize(German);
</script>

<Flatpickr
	class="w-full transition duration-200 bg-surface-200-700-token focus:brightness-105 !cursor-pointer
hover:brightness-105 !ring-0 border-token border-surface-400-500-token focus-within:border-primary-500 rounded-token"
	{options}
	bind:value={selected}
/>
