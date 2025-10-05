<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		value?: string;
		delay?: number;
		minLength?: number;
		type?: 'text' | 'search';
		placeholder?: string;
		name?: string;
		id?: string;
		disabled?: boolean;
		autocomplete?: AutoFill | undefined | null;
		ariaLabel?: string;

		className?: string;
		inputProps?: Partial<HTMLInputAttributes>;

		onValueChange?: (v: string) => void;
		onDebounced?: (v: string) => void;
	}
	let {
		value = '',
		delay = 300,
		minLength = 0,
		type = 'search',
		placeholder = '',
		name,
		id,
		disabled,
		autocomplete = 'off',
		ariaLabel,
		className,
		inputProps = {},
		onValueChange,
		onDebounced
	}: Props = $props();

	let timer: ReturnType<typeof setTimeout> | null = null;

	function triggerDebounced() {
		if (disabled) return;
		if (value.length >= minLength) onDebounced?.(value);
	}

	function schedule() {
		if (timer) clearTimeout(timer);
		if (disabled) return;
		timer = setTimeout(triggerDebounced, delay);
	}

	function handleInput() {
		onValueChange?.(value);
		schedule();
	}

	function handleBlur() {
		if (timer) clearTimeout(timer);
		triggerDebounced();
	}

	$effect(() => {
		return () => {
			if (timer) clearTimeout(timer);
		};
	});
</script>

<input
	{type}
	{name}
	{id}
	class={className}
	bind:value
	{placeholder}
	{disabled}
	{autocomplete}
	aria-label={ariaLabel}
	oninput={handleInput}
	onblur={handleBlur}
	{...inputProps}
/>
