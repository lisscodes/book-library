import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./features/books/slice";
import authReducer from "./features/auth/slice";
import loansReducer from "./features/loans/slice";
import favoritesReducer from "../redux/features/favorites/slice";
import waitlistReducer from "../redux/features/waitList/slice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
    loans: loansReducer,
    favorites: favoritesReducer,
    waitlist: waitlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
