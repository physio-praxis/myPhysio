import { beforeNavigate, goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { Navigation } from '@sveltejs/kit';
import { onMount } from 'svelte';
import { writable, type Readable } from 'svelte/store';

interface UnsavedChangesStore extends Readable<boolean> {
	confirmLeave: () => void;
	cancelLeave: () => void;
}

export function useUnsavedChanges(hasChanges: () => boolean): UnsavedChangesStore {
	const { subscribe, set } = writable(false);
	let pendingNavigation: Navigation | null = null;
	let allowNavigation = false;

	// internal app navigation
	beforeNavigate((navigation) => {
		// leaving website
		if (navigation.type === 'leave') {
			return;
		}
		if (allowNavigation) {
			allowNavigation = false;
			return;
		}

		if (hasChanges()) {
			navigation.cancel();
			pendingNavigation = navigation;
			set(true);
		}
	});

	// Browser navigation (tab close, refresh, external links)
	onMount(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
			if (hasChanges()) {
				e.preventDefault();
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	function confirmLeave(): void {
		set(false);
		if (pendingNavigation) {
			const targetPath = pendingNavigation.to?.url.pathname;
			if (targetPath) {
				allowNavigation = true;
				goto(resolve(targetPath, {}));
				pendingNavigation = null;
			}
		}
	}

	function cancelLeave(): void {
		set(false);
		pendingNavigation = null;
	}

	return {
		subscribe,
		confirmLeave,
		cancelLeave
	};
}
