import { expect, describe, vi, it, beforeEach } from 'vitest';

// ------------------------ MOCKS -------------------------
type MqlChangeEvent = { matches: boolean };
type Mql = {
	matches: boolean;
	addEventListener: (type: 'change', cb: (e: MqlChangeEvent) => void) => void;
	removeEventListener: (type: 'change', cb: (e: MqlChangeEvent) => void) => void;
	_listener?: (e: MqlChangeEvent) => void;
	dispatch: (matches: boolean) => void;
};

function createMql(initial: boolean): { mql: Mql; addCalls: number; removeCalls: number } {
	let addCalls = 0;
	let removeCalls = 0;
	const mql: Mql = {
		matches: initial,
		addEventListener: (_type, cb) => {
			addCalls++;
			mql._listener = cb;
		},
		removeEventListener(_type, cb) {
			removeCalls++;
			expect(cb).toBe(mql._listener);
		},
		dispatch: (next) => {
			mql.matches = next;
			mql._listener?.({ matches: next });
		}
	};
	return { mql, addCalls, removeCalls };
}

// to import breakpoint after mock
async function importBreakpoint() {
	return await import('./breakpoint');
}

// --------------- Tests ----------------------

describe('breakpoint store', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.unstubAllGlobals();
	});

	describe('SSR', () => {
		it('returns false and does not access window when browser=false', async () => {
			// Arrange
			vi.doMock('$app/environment', () => ({ browser: false, virtual: true }));

			const { isMobile } = await importBreakpoint();
			let latest: boolean | undefined;

			// Act
			const unsubscribe = isMobile.subscribe((value) => (latest = value));

			// Assert
			expect(latest).toBe(false);
			unsubscribe();
		});
	});

	describe('Browser', () => {
		it('subscribes, uses matchMedia, and emits the current state immediately', async () => {
			// Arrange
			vi.doMock('$app/environment', () => ({ browser: true, virtual: true }));
			let receivedQuery: string | undefined;
			const { mql } = createMql(true);

			// @ts-expect-error - test env
			globalThis.window = {
				matchMedia: (query: string) => {
					receivedQuery = query;
					return mql as unknown as MediaQueryList;
				}
			};

			const { isMobile } = await importBreakpoint();
			let latest: boolean | undefined;

			// Act
			const unsubscribe = isMobile.subscribe((value) => (latest = value));

			// Assert
			expect(receivedQuery).toBe('(max-width: 767px)');
			expect(latest).toBe(true);
			unsubscribe();
		});

		it('reacts to change events from matchMedia', async () => {
			// Arrange
			vi.doMock('$app/environment', () => ({ browser: true, virtual: true }));
			const { mql } = createMql(false);

			// @ts-expect-error - test env
			globalThis.window = {
				matchMedia: () => mql as unknown as MediaQueryList
			};

			const { isMobile } = await importBreakpoint();
			const values: boolean[] = [];

			// Act
			const unsubscribe = isMobile.subscribe((value) => values.push(value));
			mql.dispatch(true);
			mql.dispatch(false);

			// Assert
			expect(values).toEqual([false, true, false]);
			unsubscribe();
		});

		it('registers a single listener on first subscribe and removes it on last unsubscribe', async () => {
			// Arrange
			vi.doMock('$app/environment', () => ({ browser: true, virtual: true }));
			const { mql } = createMql(true);

			// @ts-expect-error - test env
			globalThis.window = {
				matchMedia: () => mql as unknown as MediaQueryList
			};

			const { isMobile } = await importBreakpoint();

			// Act
			const unsubscribe1 = isMobile.subscribe(() => {});
			const unsubscribe2 = isMobile.subscribe(() => {});

			// Assert
			expect(mql._listener).toBeTypeOf('function');

			unsubscribe1();
			unsubscribe2();
		});

		it('add/remove event listener counts are correct across subscribe/unsubscribe', async () => {
			// Arrange
			vi.doMock('$app/environment', () => ({ browser: true, virtual: true }));
			let addCount = 0;
			let removeCount = 0;
			let storedListener: ((e: MqlChangeEvent) => void) | undefined;

			const mql: Mql = {
				matches: true,
				addEventListener: (_t, cb) => {
					addCount++;
					storedListener = cb;
				},
				removeEventListener: (_t, cb) => {
					removeCount++;
					expect(cb).toBe(storedListener);
				},
				dispatch: () => {}
			};

			// @ts-expect-error - test env
			globalThis.window = {
				matchMedia: () => mql as unknown as MediaQueryList
			};
			const { isMobile } = await importBreakpoint();

			// Act
			const unsubscribe1 = isMobile.subscribe(() => {});
			const unsubscribe2 = isMobile.subscribe(() => {});

			// Assert
			expect(addCount).toBe(1);

			unsubscribe1();
			expect(removeCount).toBe(0);
			unsubscribe2();
			expect(removeCount).toBe(1);
		});
	});
});
