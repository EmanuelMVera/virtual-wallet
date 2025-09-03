import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Account, ApiErrorBody } from "../../types";
import type { AxiosError } from "axios";

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

// GET /accounts/account  -> { account }
export const getMyAccount = createAsyncThunk<
  { account: Account }, // Return (fulfilled)
  void, // Arg
  { rejectValue: string } // Reject payload
>("account/me", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/accounts/account");
    return data as { account: Account };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "No se pudo obtener la cuenta";
    return rejectWithValue(msg);
  }
});

// GET /accounts/find?query=...
export const findAccount = createAsyncThunk<
  { account: Account | null }, // Return
  string, // Arg: query
  { rejectValue: string } // Reject
>("account/find", async (query, { rejectWithValue }) => {
  try {
    const { data } = await api.get(
      `/accounts/find?query=${encodeURIComponent(query)}`
    );
    return data as { account: Account | null };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "No se pudo buscar la cuenta";
    return rejectWithValue(msg);
  }
});

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
        s.error = a.payload ?? "Error al obtener cuenta";
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
        s.error = a.payload ?? "Error al buscar cuenta";
      });
  },
});

export const { clearLookup } = slice.actions;
export default slice.reducer;
