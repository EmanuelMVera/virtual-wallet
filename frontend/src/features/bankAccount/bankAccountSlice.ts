import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { BankAccount } from "../../types";

interface BAState {
  list: BankAccount[];
  loading: boolean;
  error: string | null;
}
const initialState: BAState = { list: [], loading: false, error: null };

export const listBankAccounts = createAsyncThunk("ba/list", async () => {
  const { data } = await api.get("/bank-accounts");
  return data as { bankAccounts: BankAccount[] };
});

export const depositFromBank = createAsyncThunk(
  "ba/deposit",
  async (amount: number, thunkAPI) => {
    try {
      const { data } = await api.post("/bank-accounts/deposit", { amount });
      return data as { ok: true; newBalance: number };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message ?? "Depósito fallido"
      );
    }
  }
);

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
        s.error = a.payload as string;
      });
  },
});
export default slice.reducer;
