import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WaitlistEntry } from "./types";
import { fetchWaitlist, joinWaitlist, removeWaitlist } from "./thunks";

interface WaitlistState {
  items: WaitlistEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: WaitlistState = {
  items: [],
  loading: false,
  error: null,
};

export const waitlistSlice = createSlice({
  name: "waitlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWaitlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWaitlist.fulfilled, (state, action: PayloadAction<WaitlistEntry[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar fila de espera.";
      })
      .addCase(joinWaitlist.fulfilled, (state, action: PayloadAction<WaitlistEntry>) => {
        state.items.push(action.payload);
      })
      .addCase(removeWaitlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((entry) => entry.id !== action.payload);
      });
  },
});

export default waitlistSlice.reducer;
