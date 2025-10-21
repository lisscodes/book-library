import { supabase } from "./supabaseClient";

/**
 * Buscar todos os empréstimos do usuário atual.
 * Recupera detalhes do livro da API Gutendex.
 */
export async function getLoans() {
  console.log("📥 Requisitando lista de empréstimos do usuário...");

  // Obter usuário autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  // Buscar os empréstimos no Supabase
  const { data, error } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", user.id)
    .order("borrowed_at", { ascending: false });

  if (error) {
    console.error("❌ Erro ao buscar empréstimos:", error.message);
    throw error;
  }

  // 🔹 Buscar dados dos livros na API Gutendex
  const loansWithBooks = await Promise.all(
    (data || []).map(async (loan) => {
      try {
        const response = await fetch(`https://gutendex.com/books/${loan.book_id}`);
        const bookData = await response.json();
        return { ...loan, book: bookData };
      } catch {
        console.warn(`⚠️ Não foi possível buscar detalhes do livro ${loan.book_id}`);
        return { ...loan, book: null };
      }
    })
  );

  console.log("✅ Empréstimos carregados com dados de livros:", loansWithBooks);
  return loansWithBooks;
}

/**
 * Criar um novo empréstimo (14 dias de duração).
 */
export async function borrowBook({
  user_id,
  book_id,
}: {
  user_id: string;
  book_id: string;
}) {
  console.log("📤 Criando empréstimo:", { user_id, book_id });

  // 1️⃣ Verificar se já existe empréstimo ativo do mesmo livro para o usuário
  const { data: existingLoans, error: checkError } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", user_id)
    .eq("book_id", book_id)
    .eq("status", "active");

  if (checkError) {
    console.error("❌ Erro ao verificar empréstimos existentes:", checkError.message);
    throw checkError;
  }

  if (existingLoans && existingLoans.length > 0) {
    console.warn("⚠️ Empréstimo duplicado detectado para o mesmo livro.");
    throw new Error("Este livro já está emprestado para você.");
  }

  // 2️⃣ Criar novo empréstimo se não houver ativo
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const { data, error } = await supabase
    .from("loans")
    .insert([
      {
        user_id,
        book_id,
        due_date: dueDate.toISOString(),
        status: "active",
        borrowed_at: new Date().toISOString(),
      },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("❌ Erro Supabase (borrowBook):", error.message);
    throw error;
  }

  console.log("✅ Empréstimo inserido:", data);
  return data;
}

/**
 * Atualizar empréstimo para status 'returned' e registrar data de devolução.
 */
export async function returnBook({ loan_id }: { loan_id: string }) {
  console.log("📤 Atualizando status do empréstimo para 'returned':", loan_id);

  const { data, error } = await supabase
    .from("loans")
    .update({
      status: "returned",
      returned_at: new Date().toISOString(),
    })
    .eq("id", loan_id)
    .select("*")
    .single();

  if (error) {
    console.error("❌ Erro Supabase (returnBook):", error.message);
    throw error;
  }

  console.log("✅ Empréstimo devolvido:", data);
  return data;
}
