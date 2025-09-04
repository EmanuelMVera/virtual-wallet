import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Transaction, ApiErrorBody } from "../../types";
import type { AxiosError } from "axios";
import type { RootState } from "../../app/store";

interface TxState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}
const initialState: TxState = { items: [], loading: false, error: null };

export const listTransactions = createAsyncThunk<
  { transactions: Transaction[] },
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

const isCBU = (q: string) => /^\d{10,}$/.test(q);

export const transfer = createAsyncThunk<
  {
    transaction: Transaction;
    senderAccount: { id: number; balance: number };
    receiverAccount: { id: number; balance: number };
  },
  { to: string; amount: number; concept?: string },
  { state: RootState; rejectValue: string }
>("tx/transfer", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const senderAccountId = state.account.me?.id;
    if (!senderAccountId)
      return rejectWithValue("No se encontró tu cuenta (senderAccountId).");

    const body: Record<string, unknown> = {
      senderAccountId,
      amount: payload.amount,
    };
    if (isCBU(payload.to)) body.receiverCbu = payload.to;
    else body.receiverAlias = payload.to;

    const { data } = await api.post("/transactions/transfer", body);
    // backend devuelve: { message, transaction, senderAccount, receiverAccount }
    return data as {
      transaction: Transaction;
      senderAccount: { id: number; balance: number };
      receiverAccount: { id: number; balance: number };
    };
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
