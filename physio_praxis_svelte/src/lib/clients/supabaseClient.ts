import { createClient } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';
import type { Database } from "$lib/gen/supabase";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);