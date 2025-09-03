import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { BankAccount, ApiErrorBody } from "../../types";
import type { AxiosError } from "axios";

interface BAState {
  list: BankAccount[];
  loading: boolean;
  error: string | null;
}
const initialState: BAState = { list: [], loading: false, error: null };

export const listBankAccounts = createAsyncThunk<
  { bankAccounts: BankAccount[] }, // Return
  void,
  { rejectValue: string }
>("ba/list", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/bank-accounts");
    return data as { bankAccounts: BankAccount[] };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "No se pudo obtener cuentas bancarias";
    return rejectWithValue(msg);
  }
});

export const depositFromBank = createAsyncThunk<
  { ok: true; newBalance: number }, // Return
  number, // Arg: amount
  { rejectValue: string } // Reject
>("ba/deposit", async (amount, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/bank-accounts/deposit", { amount });
    return data as { ok: true; newBalance: number };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "Depósito fallido";
    return rejectWithValue(msg);
  }
});

const slice = createSlice({
  name: "bankAccount",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(listBankAccounts.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(listBankAccounts.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.bankAccounts;
      })
      .addCase(listBankAccounts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? "Error al cargar cuentas bancarias";
      })
      .addCase(depositFromBank.rejected, (s, a) => {
        s.error = a.payload ?? "Depósito fallido";
      });
  },
});
export default slice.reducer;
