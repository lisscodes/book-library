import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { Book } from "./types";

// --- seletores básicos ---
export const selectBooksState = (state: RootState) => state.books;

export const selectBooks = (state: RootState): Book[] => state.books.books;

export const selectQuery = (state: RootState): string => state.books.searchQuery;

// --- derive memorizado: filtro de busca (título) ---
export const selectFilteredBooks = createSelector(
  [selectBooks, selectQuery],
  (books, q) => {
    const query = (q || "").trim().toLowerCase();
    if (!query) return books;
    return books.filter((b) => b.title.toLowerCase().includes(query));
  }
);

// --- seções memorizadas (evita recalcular a cada render) ---
export const selectRecommendedBooks = createSelector(
  [selectFilteredBooks],
  (list) => list.slice(0, 8)
);

export const selectPopularBooks = createSelector(
  [selectFilteredBooks],
  (list) => list.slice(8, 16)
);
