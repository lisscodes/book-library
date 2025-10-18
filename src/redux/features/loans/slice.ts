import { createSlice } from "@reduxjs/toolkit";
import { Loan } from "./types";
import { fetchLoans, createLoan, returnLoan } from "./thunks";

interface LoanState {
  items: Loan[];
  loading: boolean;
  error: string | null;
}

const initialState: LoanState = { items: [], loading: false, error: null };

export const loanSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLoans.pending, state => { state.loading = true; })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar empréstimos";
      })
      .addCase(createLoan.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(returnLoan.fulfilled, (state, action) => {
        const idx = state.items.findIndex(l => l.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default loanSlice.reducer;
