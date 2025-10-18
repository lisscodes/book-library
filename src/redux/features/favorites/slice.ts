import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Favorite } from "./types";
import { fetchFavorites, toggleFavorite } from "./thunks";

interface FavoriteState {
  items: Favorite[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  items: [],
  loading: false,
  error: null,
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Favorite[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar favoritos.";
      })
      .addCase(toggleFavorite.fulfilled, (state, action: PayloadAction<Favorite>) => {
        const exists = state.items.find((fav) => fav.book_id === action.payload.book_id);
        if (exists) {
          state.items = state.items.filter((fav) => fav.book_id !== action.payload.book_id);
        } else {
          state.items.push(action.payload);
        }
      });
  },
});

export default favoritesSlice.reducer;
