import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Book } from "./types";
import type { RootState } from "../../store";

export const fetchBooks = createAsyncThunk<
  Book[],
  string | undefined,
  { state: RootState; rejectValue: string }
>(
  "books/fetchBooks",
  async (url, thunkAPI) => {
    const { searchQuery, language, topic, sort } = thunkAPI.getState().books;

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (language) params.append("languages", language);
      if (topic) params.append("topic", topic);
      if (sort) params.append("sort", sort);

      // 🔹 Define a URL de busca
      const fetchUrl = url
        ? url
        : `https://gutendex.com/books?${params.toString()}`;

      const res = await fetch(fetchUrl);
      const data = await res.json();

      thunkAPI.dispatch({
        type: "books/setPagination",
        payload: { next: data.next, previous: data.previous },
      });

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
