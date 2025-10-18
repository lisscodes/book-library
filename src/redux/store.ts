import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./features/books/slice";
import authReducer from "./features/auth/slice";
import loansReducer from "./features/loans/slice";
import favoritesReducer from "../redux/features/favorites/slice";
import waitlistReducer from "../redux/features/waitList/slice";

// 🔹 Cria a store global com todos os reducers
export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
    loans: loansReducer,
    favorites: favoritesReducer,
    waitlist: waitlistReducer,
  },
});

// 🔹 Tipo global do estado da store
export type RootState = ReturnType<typeof store.getState>;

// 🔹 Tipo global do dispatch
export type AppDispatch = typeof store.dispatch;
