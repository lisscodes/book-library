import { createAsyncThunk } from "@reduxjs/toolkit";
import * as loanService from "../../../services/loanService";
import { Loan } from "./types";

/**
 * Buscar todos os empréstimos registrados no Supabase.
 */
export const fetchLoans = createAsyncThunk<Loan[]>(
  "loans/fetchAll",
  async () => {
    console.log("📥 Buscando todos os empréstimos...");
    const data = await loanService.getLoans();
    console.log("✅ Empréstimos carregados:", data);
    return data;
  }
);

/**
 * Criar um novo empréstimo no Supabase.
 * Recebe o user_id e o book_id do usuário logado e livro selecionado.
 */
export const createLoan = createAsyncThunk<
  Loan,
  { user_id: string; book_id: string }
>("loans/create", async ({ user_id, book_id }, { rejectWithValue }) => {
  try {
    console.log("Criando empréstimo com:", { user_id, book_id });
    const data = await loanService.borrowBook({ user_id, book_id });
    console.log("Empréstimo criado com sucesso:", data);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro ao criar empréstimo:", error.message);
    return rejectWithValue(error.message);
  }
});


export const returnLoan = createAsyncThunk<Loan, { loan_id: string }>(
  "loans/return",
  async ({ loan_id }, { rejectWithValue }) => {
    try {
      console.log("Marcando empréstimo como devolvido:", loan_id);
      const data = await loanService.returnBook({ loan_id });
      console.log("Empréstimo devolvido:", data);
      return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao devolver empréstimo:", error.message);
      return rejectWithValue(error.message);
    }
  }
);
