import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Transaction } from "../../types";

interface TxState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}
const initialState: TxState = { items: [], loading: false, error: null };

export const listTransactions = createAsyncThunk("tx/list", async () => {
  const { data } = await api.get("/transactions/list");
  return data as { transactions: Transaction[] };
});

export const transfer = createAsyncThunk(
  "tx/transfer",
  async (
    payload: { to: string; amount: number; concept?: string },
    thunkAPI
  ) => {
    try {
      const { data } = await api.post("/transactions/transfer", payload);
      return data as { transaction: Transaction; newBalance: number };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message ?? "Transferencia fallida"
      );
    }
  }
);

const slice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(listTransactions.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(listTransactions.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.transactions;
      })
      .addCase(listTransactions.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })
      .addCase(transfer.fulfilled, (s, a) => {
        // optimista: insertar al inicio
        s.items.unshift(a.payload.transaction);
      });
  },
});
export default slice.reducer;
