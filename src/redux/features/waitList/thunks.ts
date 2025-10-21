import { createAsyncThunk } from "@reduxjs/toolkit";
import * as waitlistService from "../../../services/waitListService";
import { WaitlistEntry } from "./types";

export const fetchWaitlist = createAsyncThunk<WaitlistEntry[]>(
  "waitlist/fetchAll",
  async () => {
    return await waitlistService.getWaitlist();
  }
);

export const joinWaitlist = createAsyncThunk<
  WaitlistEntry,
  { user_id: string; book_id: string }
>("waitlist/join", async ({ user_id, book_id }) => {
  const data = await waitlistService.joinWaitlist(user_id, book_id);
  return data;
});

export const removeWaitlist = createAsyncThunk<string, string>(
  "waitlist/remove",
  async (id) => {
    await waitlistService.removeFromWaitlist(id);
    return id;
  }
);
