import { browser } from "$app/environment";
import { readable, type Readable } from "svelte/store";

function mediaQuery(query: string): Readable<boolean> {
    return readable(false, (set) => {
        if (!browser) {
            set(false);
            return () => {};
        }

        const mql = window.matchMedia(query);
        const update = () => set(mql.matches);

        update();
        mql.addEventListener('change', update);

        return () => mql.removeEventListener('change', update);
    });
}

export const isMobile = mediaQuery('(max-width: 767px)');