import { createAsyncThunk } from "@reduxjs/toolkit";
import * as favoriteService from "../../../services/favoriteService";
import { Favorite } from "./types";

export const fetchFavorites = createAsyncThunk<Favorite[]>(
  "favorites/fetchAll",
  async () => {
    return await favoriteService.getFavorites();
  }
);

export const toggleFavorite = createAsyncThunk<
  Favorite,
  { user_id: string; book_id: string }
>("favorites/toggle", async ({ user_id, book_id }) => {
  const data = await favoriteService.toggleFavorite(user_id, book_id);
  return data;
});
