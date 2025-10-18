import { createAsyncThunk } from "@reduxjs/toolkit";
import * as loanService from "../../../services/loanService";

export const fetchLoans = createAsyncThunk("loans/fetchAll", loanService.getLoans);
export const createLoan = createAsyncThunk("loans/create", loanService.borrowBook);
export const returnLoan = createAsyncThunk("loans/return", loanService.returnBook);
