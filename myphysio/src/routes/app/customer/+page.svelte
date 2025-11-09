<script lang="ts">
	import CustomerViewCard from '$lib/components/CustomerViewCard.svelte';
	import DebounceInput from '$lib/components/DebounceInput.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { UserPlus, Search, CircleQuestionMark, X } from '@lucide/svelte';
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { CustomerSearchItem, CustomerSearchResponse } from '$lib/types/customerTypes';
	import { resolve } from '$app/paths';

	// ------------------ SSR Data --------------------------
	interface Data {
		initialItems: CustomerSearchItem[];
		initialCursor?: string;
		initialQuery: string;
		limit: number;
	}
	let { data }: { data: Data } = $props();

	// ------------------ State ----------------------------
	let query = $state(data.initialQuery ?? '');
	let items = $state<CustomerSearchItem[]>(data.initialItems ?? []);
	let loading = $state(false);
	let nextCursor = $state<string | undefined>(data.initialCursor);
	let controller = $state<AbortController | null>(null);

	async function runSearch(reset: boolean) {
		loading = true;

		controller?.abort();
		controller = new AbortController();

		const params = new SvelteURLSearchParams();
		if (query) {
			params.set('query', query);
		}
		params.set('limit', String(data.limit));
		if (!reset && nextCursor) {
			params.set('cursor', nextCursor);
		}

		try {
			const res = await fetch(`/app/customer/search?${params.toString()}`, {
				signal: controller.signal
			});

			if (!res.ok) throw new Error(`HTTP ${res.status}`);

			const payload: CustomerSearchResponse = await res.json();

			items = reset ? payload.items : [...items, ...payload.items];
			nextCursor = payload.nextCursor;
		} catch (e: unknown) {
			if (e instanceof DOMException && e.name === 'AbortError') return;
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function loadMore() {
		if (!loading && nextCursor) {
			runSearch(false);
		}
	}

	// ------------------ Infinite Scroll -------------------
	let infiniteScrollIndicator: HTMLDivElement | null = null;

	$effect(() => {
		if (!infiniteScrollIndicator) return;
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && nextCursor && !loading) {
					loadMore();
				}
			},
			{ root: null, rootMargin: '0px 0px 400px 0px', threshold: 0 }
		);

		observer.observe(infiniteScrollIndicator);
		return () => observer.disconnect();
	});

	// ------------------ Search Input ----------------------
	const longSearchHint = 'Suche nach Name, Kontakinformationen oder Haustiere (Name/Rasse/Art)…';
	const shortSearchHint = 'Suche...';
	let searchHelpPopoverOpen = $state(false);
	function closeSearchHelpPopover() {
		searchHelpPopoverOpen = false;
	}
</script>

<section class="mb-4 flex w-full flex-col space-y-4 card preset-filled-surface-100-900 px-4 py-2">
	<header class="flex items-center justify-between">
		<div class="flex items-baseline space-x-2">
			<h5 class="h5">Kundensuche</h5>
			<Popover
				open={searchHelpPopoverOpen}
				onOpenChange={(e) => (searchHelpPopoverOpen = e.open)}
				positioning={{ placement: 'bottom' }}
				triggerBase="md:hidden text-tertiary-500"
				contentBase="card bg-surface-200-800 p-4 max-w-[320px]"
				arrow
				arrowBackground="!bg-surface-800"
			>
				{#snippet trigger()}
					<CircleQuestionMark size="18" />
				{/snippet}
				{#snippet content()}
					<header class="flex justify-between">
						<p class="text-xl font-bold">Hinweis</p>
						<button
							class="btn-icon hover:preset-tonal"
							onclick={closeSearchHelpPopover}
							title="Close"
							aria-label="Close"><X /></button
						>
					</header>
					<article>
						<p class="opacity-60">{longSearchHint}</p>
					</article>
				{/snippet}
			</Popover>
		</div>
		<a href={resolve('/app/customer/add', {})} class="btn preset-filled-primary-500">
			<UserPlus />
			<span class="hidden md:block"> Kunde hinzufügen </span>
		</a>
	</header>
	<form role="search" onsubmit={(event) => event.preventDefault()}>
		<div class="input-group grid-cols-[auto_1fr_auto]">
			<div class="ig-cell preset-tonal">
				<Search />
			</div>
			<!-- Mobile search input -->
			<DebounceInput
				id="customer-search-mobile"
				className="ig-input md:hidden"
				ariaLabel="Kundensuche"
				type="search"
				placeholder={shortSearchHint}
				value={query}
				onValueChange={(value) => (query = value)}
				onDebounced={() => runSearch(true)}
				delay={300}
				minLength={0}
				inputProps={{ spellcheck: false, inputmode: 'search' }}
			/>
			<!-- Desktop search input -->
			<DebounceInput
				id="customer-search-desktop"
				className="ig-input hidden md:block"
				ariaLabel="Kundensuche"
				type="search"
				placeholder={longSearchHint}
				value={query}
				onValueChange={(value) => (query = value)}
				onDebounced={() => runSearch(true)}
				delay={300}
				minLength={0}
				inputProps={{ spellcheck: false, inputmode: 'search' }}
			/>
		</div>
	</form>
</section>

{#if items.length === 0 && !loading}
	<p class="text-center text-sm text-neutral-400">Keine Ergebnisse.</p>
{/if}

<section class="mb-8 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
	{#each items as item (item.customer.customerId)}
		<CustomerViewCard customerSearchItem={item} />
	{/each}

	{#if loading}
		<Spinner />
	{/if}

	<!-- infinite scroll indicator -->
	<div bind:this={infiniteScrollIndicator} class="h-8 w-full"></div>
</section>
