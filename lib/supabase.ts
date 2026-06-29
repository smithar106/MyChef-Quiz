import { createClient, SupabaseClient } from "@supabase/supabase-js";

/*
-- create table quiz_leads (
--   id uuid primary key default gen_random_uuid(),
--   email text,
--   archetype_id text not null,
--   answers jsonb,
--   created_at timestamptz default now()
-- );
*/

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

export { getSupabase };
