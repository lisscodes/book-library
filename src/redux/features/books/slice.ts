import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchBooks } from "./thunks";
import type { BooksState, Book } from "./types";

const initialState: BooksState = {
  books: [],
  isLoading: false,
  searchQuery: "",
  error: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload || "";
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
      });
  },
});

export const { setQuery } = booksSlice.actions;
export default booksSlice.reducer;
