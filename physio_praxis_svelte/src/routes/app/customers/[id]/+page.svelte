<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import { HeadTags } from '$lib/types/classes';
	import type { Customer, Pet } from '$lib/types/types.js';

	const headTags = new HeadTags('View MyPhysio Customer', 'a customer at MyPhysio');

	export let data;
	let customer: Customer;
	let pets: Pet[];
	$: customer = data.customer;
	$: pets = data.pets;

	async function copyToClipboard(value: string) {
		await navigator.clipboard.writeText(value);
	}
</script>

<Head {headTags} />

<h1 class="h1 mb-8">{customer.name}</h1>

<section>
	<div class="flex flex-col justify-between">
		<h2 class="h2 mb-4">Kundeninformation</h2>
		<table class="table table-hover">
			<tbody class="*:flex *:justify-center *:items-center">
				<tr>
					<th class="p-2">Name:</th>
					<td class="w-full"><div class="text-xl">{customer.name}</div></td>
					<td>
						<button
							class="btn variant-filled-secondary"
							title="kopieren"
							on:click={() => copyToClipboard(customer.name ?? '')}
						>
							<iconify-icon icon="mdi:content-copy" observer="false" />
						</button>
					</td>
				</tr>
				<tr>
					<th class="p-2">Telefonnummer:</th>
					<td class="w-full"><div class="text-xl">{customer.phone_number}</div></td>
					<td>
						<button
							class="btn variant-filled-secondary"
							title="kopieren"
							on:click={() => copyToClipboard(customer.phone_number ?? '')}
						>
							<iconify-icon icon="mdi:content-copy" observer="false" />
						</button>
					</td>
				</tr>
				<tr>
					<th class="p-2 text-nowrap">E-Mail:</th>
					<td class="w-full"><div class="text-xl">{customer.email}</div></td>
					<td>
						<button
							class="btn variant-filled-secondary"
							title="kopieren"
							on:click={() => copyToClipboard(customer.email ?? '')}
						>
							<iconify-icon icon="mdi:content-copy" observer="false" />
						</button>
					</td>
				</tr>
				<tr>
					<th class="p-2 text-nowrap">Adresse:</th>
					<td class="w-full"><div class="text-xl">{customer.address}</div></td>
					<td>
						<button
							class="btn variant-filled-secondary"
							title="kopieren"
							on:click={() => copyToClipboard(customer.address ?? '')}
						>
							<iconify-icon icon="mdi:content-copy" observer="false" />
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</section>
<section>
	pets: {pets.length}
</section>
