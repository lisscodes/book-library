import { supabase } from "./supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

interface AuthResponse {
  user: User | null;
  session: Session | null;
  message?: string;
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: cleanPassword,
  });

  if (error) {
    console.error("[AuthService] signUp error:", error.message);
    throw new Error("Erro ao criar conta. Tente novamente.");
  }

  return { user: data.user, session: data.session };
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: cleanPassword,
  });

  if (error) {
    console.error("[AuthService] signIn error:", error.message);
    throw new Error("Credenciais inválidas ou conta inexistente.");
  }

  return { user: data.user, session: data.session };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("[AuthService] signOut error:", error.message);
    throw new Error("Erro ao encerrar sessão.");
  }
}
