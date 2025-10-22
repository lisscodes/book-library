import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchBooks, fetchBookById } from "./thunks";
import type { BooksState, Book } from "./types";

const initialState: BooksState = {
  books: [],
  isLoading: false,
  searchQuery: "",
  language: "",
  topic: "",
  sort: "",
  next: null,
  previous: null,
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
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
    },
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
    setPagination: (
      state,
      action: PayloadAction<{ next: string | null; previous: string | null }>
    ) => {
      state.next = action.payload.next;
      state.previous = action.payload.previous;
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
      });
  },
});

export const {
  setQuery,
  setLanguage,
  setTopic,
  setSort,
  clearSelectedBook,
  setPagination,
} = booksSlice.actions;

export default booksSlice.reducer;
