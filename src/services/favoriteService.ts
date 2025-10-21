import { supabase } from "./supabaseClient";
import type { Favorite } from "../redux/features/favorites/types";

/**
 * Retorna todos os livros favoritados do usuário atual.
 * Os detalhes do livro serão buscados da API Gutendex.
 */
export async function getFavorites(): Promise<Favorite[]> {
  console.log("💜 Buscando favoritos do usuário atual...");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  // 🔹 Buscar favoritos no Supabase
  const { data, error } = await supabase
    .from("favorites")
    .select("id, user_id, book_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Erro ao buscar favoritos:", error.message);
    throw error;
  }

  // 🔹 Buscar informações completas do livro na API Gutendex
  const favoritesWithBooks = await Promise.all(
    (data || []).map(async (fav) => {
      try {
        const res = await fetch(`https://gutendex.com/books/${fav.book_id}`);
        const bookData = await res.json();
        return { ...fav, book: bookData };
      } catch {
        console.warn(`⚠️ Falha ao carregar detalhes do livro ${fav.book_id}`);
        return { ...fav, book: null };
      }
    })
  );

  console.log("✅ Favoritos carregados:", favoritesWithBooks);
  return favoritesWithBooks;
}

/**
 * Adiciona ou remove um livro dos favoritos do usuário.
 */
export async function toggleFavorite(user_id: string, book_id: string) {
  console.log("💜 Tentando alternar favorito:", { user_id, book_id });

  // Verifica se já existe esse livro nos favoritos do usuário
  const { data: existing, error: existingError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user_id)
    .eq("book_id", book_id)
    .maybeSingle();

  if (existingError) {
    console.error("❌ Erro ao verificar favorito existente:", existingError.message);
    throw existingError;
  }

  if (existing) {
    // Se já existe, remove dos favoritos
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      console.error("❌ Erro ao remover favorito:", deleteError.message);
      throw deleteError;
    }

    console.log("💜 Favorito removido:", book_id);
    return { removed: true };
  }

  // Caso contrário, adiciona aos favoritos
  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id, book_id }])
    .select("*")
    .maybeSingle(); // evita erro 406

  if (error) {
    console.error("❌ Erro ao inserir favorito:", error.message);
    throw error;
  }

  console.log("✅ Favorito adicionado:", data);
  return data;
}
