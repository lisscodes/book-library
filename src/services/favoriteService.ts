import { supabase } from "./supabaseClient";

export async function getFavorites() {
  const { data, error } = await supabase.from("favorites").select("*");
  if (error) throw error;
  return data;
}

export async function toggleFavorite(user_id: string, book_id: string) {
  const { data: existing } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user_id)
    .eq("book_id", book_id)
    .single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return existing;
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id, book_id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
