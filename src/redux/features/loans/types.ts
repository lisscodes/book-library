import type { Book } from "../books/types";

export interface Loan {
  id: string;
  user_id: string;
  book_id: string;
  borrowed_at?: string;
  returned_at?: string;
  due_date?: string;
  status: "active" | "returned";
  book?: Book | null;
}
