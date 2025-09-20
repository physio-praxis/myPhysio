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

	interface Props {
		selected: Date | null | undefined;
	}

	let { selected = $bindable() }: Props = $props();

	flatpickr.localize(German);
</script>

<Flatpickr
	class="w-full transition duration-200 bg-surface-200-800 focus:brightness-105 !cursor-pointer
hover:brightness-105 !ring-0 border border-surface-500 focus-within:border-primary-500 rounded-base"
	{options}
	bind:value={selected}
/>
