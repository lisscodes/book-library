import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Book } from "./types";

export const fetchBooks = createAsyncThunk<Book[], void, { rejectValue: string }>(
  "books/fetchBooks",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("https://gutendex.com/books/");
      const data = await res.json();

      if (!Array.isArray(data.results)) {
        return thunkAPI.rejectWithValue("Invalid data format");
      }

      return data.results as Book[];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return thunkAPI.rejectWithValue("Error fetching books");
    }
  }
);

export const fetchBookById = createAsyncThunk<Book, number, { rejectValue: string }>(
  "books/fetchBookById",
  async (bookId, thunkAPI) => {
    try {
      const res = await fetch(`https://gutendex.com/books/${bookId}`);
      if (!res.ok) {
        return thunkAPI.rejectWithValue("Book not found");
      }

      const data = await res.json();
      return data as Book;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return thunkAPI.rejectWithValue("Error fetching book by ID");
    }
  }
);