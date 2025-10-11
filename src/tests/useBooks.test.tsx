import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../redux/features/books/slice";
import type { Book } from "../redux/features/books/types";
import { useBooks } from "../hooks/useBooks";

// 🔹 Mock de dados
const mockBooks: Book[] = [
  {
    id: 1513,
    title: "Romeo and Juliet",
    authors: [{ name: "Shakespeare, William" }],
    subjects: ["Drama"],
    formats: { "image/jpeg": "mock.jpg" },
    download_count: 12345,
  },
];

// 🔹 Cria uma store mockada para o hook
const store = configureStore({
  reducer: { books: booksReducer },
  preloadedState: {
    books: {
      books: mockBooks,
      isLoading: false,
      searchQuery: "",
      error: null,
    },
  },
});

describe("useBooks hook", () => {
  it("retorna corretamente a lista de livros e estado do carregamento", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useBooks(), { wrapper });

    // Verifica retorno do hook
    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe("Romeo and Juliet");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
