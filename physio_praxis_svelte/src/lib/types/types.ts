import type { Database } from '$lib/gen/supabase';

export type allowed_users = Database['public']['Tables']['allowed_users']['Row'] | null;
