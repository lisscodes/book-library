import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./features/books/slice";
import authReducer from "./features/auth/slice";

// 🔹 Cria a store global com ambos os reducers
export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
  },
});

// 🔹 Tipo global do estado da store
export type RootState = ReturnType<typeof store.getState>;

// 🔹 Tipo global do dispatch
export type AppDispatch = typeof store.dispatch;
