import { supabase } from "./supabaseClient";

export async function getLoans() {
  console.log("Requesting user's loan list...");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated.");

  const { data, error } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", user.id)
    .order("borrowed_at", { ascending: false });

  if (error) {
    console.error("Error fetching loans:", error.message);
    throw error;
  }

  const loansWithBooks = await Promise.all(
    (data || []).map(async (loan) => {
      try {
        const response = await fetch(`https://gutendex.com/books/${loan.book_id}`);
        const bookData = await response.json();
        return { ...loan, book: bookData };
      } catch {
        console.warn(`Could not fetch details for book ${loan.book_id}`);
        return { ...loan, book: null };
      }
    })
  );

  return loansWithBooks;
}

export async function borrowBook({
  user_id,
  book_id,
}: {
  user_id: string;
  book_id: string;
}) {
  console.log("📤 Creating loan:", { user_id, book_id });

  const { data: borrowedBook, error: borrowedError } = await supabase
    .from("loans")
    .select("*")
    .eq("book_id", book_id)
    .eq("status", "active");

  if (borrowedError) {
    console.error("Error checking borrowed book:", borrowedError.message);
    throw borrowedError;
  }

  if (borrowedBook && borrowedBook.length > 0) {
    console.warn("Book already borrowed by another user.");
    throw new Error("This book is already borrowed by another user.");
  }

  const { data: existingLoans, error: checkError } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", user_id)
    .eq("book_id", book_id)
    .eq("status", "active");

  if (checkError) {
    console.error("Error checking existing loans:", checkError.message);
    throw checkError;
  }

  if (existingLoans && existingLoans.length > 0) {
    console.warn("Duplicate loan detected for the same book.");
    throw new Error("You already have an active loan for this book.");
  }

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
    console.error("Supabase error (borrowBook):", error.message);
    throw error;
  }

  console.log("Loan created:", data);
  return data;
}


export async function returnBook({ loan_id }: { loan_id: string }) {
  console.log("Updating loan status to 'returned':", loan_id);

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
    console.error("Supabase error (returnBook):", error.message);
    throw error;
  }

  console.log("Loan returned:", data);
  return data;
}
