export interface Loan {
  id: string;
  book_id: string;
  user_id: string;
  borrowed_at: string;
  due_date: string;
  returned_at?: string;
  status: "active" | "returned";
}
