import { supabase } from "./supabaseClient";
import type { WaitlistEntry } from "../redux/features/waitList/types";

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated.");
  }

  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching waitlist:", error.message);
    throw error;
  }

  const waitlistWithBooks = await Promise.all(
    (data || []).map(async (entry) => {
      try {
        const response = await fetch(`https://gutendex.com/books/${entry.book_id}`);
        const bookData = await response.json();
        return { ...entry, book: bookData };
      } catch {
        console.warn(`Failed to fetch book details for ${entry.book_id}`);
        return { ...entry, book: null };
      }
    })
  );

  return waitlistWithBooks;
}

export async function joinWaitlist(user_id: string, book_id: string) {
  console.log("Attempting to join waitlist:", { user_id, book_id });

  const { data: existing, error: checkError } = await supabase
    .from("waitlist")
    .select("*")
    .eq("user_id", user_id)
    .eq("book_id", book_id);

  if (checkError) throw checkError;

  if (existing && existing.length > 0) {
    throw new Error("You are already on the waitlist for this book.");
  }

  const { data: activeLoans, error: loanError } = await supabase
    .from("loans")
    .select("*")
    .eq("book_id", book_id)
    .eq("status", "active");

  if (loanError) throw loanError;

  if (!activeLoans || activeLoans.length === 0) {
    throw new Error("This book is currently available — no need to join the waitlist.");
  }

  if (activeLoans.some((loan) => loan.user_id === user_id)) {
    throw new Error("You already have this book borrowed — you can't join the waitlist.");
  }

  const { data, error } = await supabase
    .from("waitlist")
    .insert([{ user_id, book_id }])
    .select("*")
    .single();

  if (error) {
    console.error("Error adding to waitlist:", error.message);
    throw error;
  }

  try {
    const response = await fetch(`https://gutendex.com/books/${book_id}`);
    const bookData = await response.json();
    return { ...data, book: bookData };
  } catch {
    return { ...data, book: null };
  }
}

export async function removeFromWaitlist(id: string) {
  const { error } = await supabase.from("waitlist").delete().eq("id", id);
  if (error) throw error;
}
