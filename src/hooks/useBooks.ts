import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export function useBooks() {
  const books = useSelector((state: RootState) => state.books.books);
  const isLoading = useSelector((state: RootState) => state.books.isLoading);
  const error = useSelector((state: RootState) => state.books.error);

  return { books, isLoading, error };
}
