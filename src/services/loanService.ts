import { supabase } from "./supabaseClient";

export async function getLoans() {
  const { data, error } = await supabase.from("loans").select("*");
  if (error) throw error;
  return data;
}

export async function borrowBook({ user_id, book_id }: { user_id: string; book_id: string }) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const { data, error } = await supabase
    .from("loans")
    .insert([{ user_id, book_id, due_date: dueDate.toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function returnBook({ loan_id }: { loan_id: string }) {
  const { data, error } = await supabase
    .from("loans")
    .update({ status: "returned", returned_at: new Date().toISOString() })
    .eq("id", loan_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
