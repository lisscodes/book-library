import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchBooks, fetchBookById } from "./thunks";
import type { BooksState, Book } from "./types";

const initialState: BooksState = {
  books: [],
  isLoading: true,
  searchQuery: "",
  error: null,
  selectedBook: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload || "";
    },
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Fetch failed";
      })
      .addCase(fetchBookById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action: PayloadAction<Book>) => {
        state.isLoading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Fetch by ID failed";
      })
  },
});

export const { setQuery } = booksSlice.actions;
export default booksSlice.reducer;
