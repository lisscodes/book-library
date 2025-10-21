import type { Book } from "../books/types";

export interface Favorite {
  id: string;
  user_id: string;
  book_id: string;
  created_at?: string;
  book?: Book;
}
