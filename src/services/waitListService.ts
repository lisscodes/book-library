import { supabase } from "./supabaseClient";
import type { WaitlistEntry } from "../redux/features/waitList/types";

/**
 * Retorna todos os livros da lista de espera do usuário atual,
 * incluindo os dados completos do livro.
 */
export async function getWaitlist(): Promise<WaitlistEntry[]> {
  // Obtém o usuário logado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabase
    .from("waitlist")
    .select(`
      id,
      user_id,
      book_id,
      created_at,
      book:books (
        id,
        title,
        author,
        description,
        category,
        cover_url,
        status
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Erro ao buscar lista de espera:", error.message);
    throw error;
  }

  return data || [];
}

/**
 * Adiciona um livro à lista de espera.
 */
export async function joinWaitlist(user_id: string, book_id: string) {
  const { data, error } = await supabase
    .from("waitlist")
    .insert([{ user_id, book_id }])
    .select(`
      id,
      user_id,
      book_id,
      created_at,
      book:books (
        id,
        title,
        author,
        description,
        category,
        cover_url,
        status
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove um livro da lista de espera.
 */
export async function removeFromWaitlist(id: string) {
  const { error } = await supabase.from("waitlist").delete().eq("id", id);
  if (error) throw error;
}
