import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Account } from "../../types";

interface AccountState {
  me: Account | null;
  lookup: Account | null;
  loading: boolean;
  error: string | null;
}
const initialState: AccountState = {
  me: null,
  lookup: null,
  loading: false,
  error: null,
};

export const getMyAccount = createAsyncThunk("account/me", async () => {
  const { data } = await api.get("/accounts/me");
  return data as { account: Account };
});

export const findAccount = createAsyncThunk(
  "account/find",
  async (query: string, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/accounts/find?query=${encodeURIComponent(query)}`
      );
      return data as { account: Account | null };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message ?? "No se pudo buscar la cuenta"
      );
    }
  }
);

const slice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearLookup: (s) => {
      s.lookup = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(getMyAccount.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(getMyAccount.fulfilled, (s, a) => {
        s.loading = false;
        s.me = a.payload.account;
      })
      .addCase(getMyAccount.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(findAccount.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(findAccount.fulfilled, (s, a) => {
        s.loading = false;
        s.lookup = a.payload.account ?? null;
      })
      .addCase(findAccount.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      });
  },
});

export const { clearLookup } = slice.actions;
export default slice.reducer;
