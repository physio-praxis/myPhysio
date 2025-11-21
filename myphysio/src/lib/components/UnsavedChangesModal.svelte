<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		open: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let { open, onConfirm, onCancel }: Props = $props();
</script>

<Modal
	{open}
	onOpenChange={(e) => {
		if (!e.open) {
			onCancel();
		}
	}}
	contentBase="card bg-surface-100-900 p-6 space-y-4 shadow-xl max-w-lg"
	backdropClasses="backdrop-blur-sm"
	positionerJustify="justify-center"
	positionerAlign="items-center"
	transitionsPositionerIn={{ duration: 150 }}
	transitionsPositionerOut={{ duration: 150 }}
>
	{#snippet content()}
		<header>
			<h3 class="h3">Ungespeicherte Änderungen</h3>
		</header>
		<article>
			<p class="text-sm">
				Sie haben ungespeicherte Änderungen. Möchten Sie die Seite wirklich verlassen?
			</p>
			<p class="text-sm text-error-500">*Alle Änderungen gehen verloren.</p>
		</article>
		<footer class="flex justify-end gap-2">
			<button type="button" class="btn preset-tonal" onclick={onCancel}>Abbrechen</button>
			<button type="button" class="btn preset-filled-error-500" onclick={onConfirm}
				>Verlassen</button
			>
		</footer>
	{/snippet}
</Modal>
