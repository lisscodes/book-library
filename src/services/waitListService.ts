import { supabase } from "./supabaseClient";

export async function getWaitlist() {
  const { data, error } = await supabase.from("waitlist").select("*");
  if (error) throw error;
  return data;
}

export async function joinWaitlist(user_id: string, book_id: string) {
  const { data, error } = await supabase
    .from("waitlist")
    .insert([{ user_id, book_id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeFromWaitlist(id: string) {
  const { error } = await supabase.from("waitlist").delete().eq("id", id);
  if (error) throw error;
}
