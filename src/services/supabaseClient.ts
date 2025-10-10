import { createClient, type SupabaseClient } from "@supabase/supabase-js";


// 🔒 Recomendado: usar variáveis de ambiente (.env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// fallback opcional (somente em dev)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Supabase credentials are missing. Check your .env or Vite environment variables."
  );
}

// ✅ Criação tipada do client
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
