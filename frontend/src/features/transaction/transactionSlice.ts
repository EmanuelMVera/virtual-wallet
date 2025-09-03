import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Transaction, ApiErrorBody } from "../../types";
import type { AxiosError } from "axios";

interface TxState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}
const initialState: TxState = { items: [], loading: false, error: null };

export const listTransactions = createAsyncThunk<
  { transactions: Transaction[] }, // Return
  void,
  { rejectValue: string }
>("tx/list", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/transactions/list");
    return data as { transactions: Transaction[] };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "No se pudo obtener transacciones";
    return rejectWithValue(msg);
  }
});

export const transfer = createAsyncThunk<
  { transaction: Transaction; newBalance: number }, // Return
  { to: string; amount: number; concept?: string }, // Arg
  { rejectValue: string }
>("tx/transfer", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/transactions/transfer", payload);
    return data as { transaction: Transaction; newBalance: number };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "Transferencia fallida";
    return rejectWithValue(msg);
  }
});

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
        s.error = a.payload ?? "Error al cargar transacciones";
      })

      .addCase(transfer.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(transfer.fulfilled, (s, a) => {
        s.loading = false;
        s.items.unshift(a.payload.transaction);
      })
      .addCase(transfer.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? "Transferencia fallida";
      });
  },
});
export default slice.reducer;
