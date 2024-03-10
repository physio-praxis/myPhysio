import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import type { Database } from "$lib/gen/supabase";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    // this will make the supabase client available to page components.
    const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
            fetch
        },
        cookies: {
            get(key) {
                if (!isBrowser()) {
                    return JSON.stringify(data.session);
                }

                const cookie = parse(document.cookie);
                return cookie[key];
            }
        }
    });

    const { data: { session } } = await supabase.auth.getSession();
    return {
        supabase,
        session
    }
}