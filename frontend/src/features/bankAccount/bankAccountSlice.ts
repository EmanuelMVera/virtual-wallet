import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { BankAccount, ApiErrorBody } from "../../types";
import type { AxiosError } from "axios";
import type { RootState } from "../../app/store";

interface BAState {
  list: BankAccount[];
  loading: boolean;
  error: string | null;
}
const initialState: BAState = { list: [], loading: false, error: null };

export const listBankAccounts = createAsyncThunk<
  { bankAccounts: BankAccount[] },
  void,
  { rejectValue: string }
>("ba/list", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/bank-accounts/list");
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
  {
    message: string;
    bankAccount: { id: number; balance: number };
    walletAccount: { id: number; balance: number };
  },
  { bankAccountId: number; amount: number },
  { state: RootState; rejectValue: string }
>("ba/deposit", async ({ bankAccountId, amount }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const walletAccountId = state.account.me?.id;
    if (!walletAccountId)
      return rejectWithValue("No se encontró tu cuenta virtual.");

    const { data } = await api.post("/bank-accounts/deposit", {
      bankAccountId,
      walletAccountId,
      amount,
    });
    return data as {
      message: string;
      bankAccount: { id: number; balance: number };
      walletAccount: { id: number; balance: number };
    };
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

export const registerBankAccount = createAsyncThunk<
  { bankAccount: BankAccount },
  { bankName: string; accountNumber: string; balance: number },
  { rejectValue: string }
>("bank/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/bank-accounts/register", payload);
    return data as { bankAccount: BankAccount };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "No se pudo registrar la cuenta";
    return rejectWithValue(msg);
  }
});

const slice = createSlice({
  name: "bankAccount",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    // list
    b.addCase(listBankAccounts.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(listBankAccounts.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload.bankAccounts;
    });
    b.addCase(listBankAccounts.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload ?? "Error al cargar cuentas bancarias";
    });

    // deposit
    b.addCase(depositFromBank.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(depositFromBank.fulfilled, (s, a) => {
      s.loading = false;
      const ba = a.payload.bankAccount;
      // reflejar nuevo saldo de la cuenta bancaria
      s.list = s.list.map((x) => (x.id === ba.id ? { ...x, balance: ba.balance } : x));
    });
    b.addCase(depositFromBank.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload ?? "Depósito fallido";
    });

    // register
    b.addCase(registerBankAccount.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(registerBankAccount.fulfilled, (s, a) => {
      s.loading = false;
      s.list = [a.payload.bankAccount, ...s.list];
    });
    b.addCase(registerBankAccount.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload ?? "No se pudo registrar la cuenta";
    });
  },
});

export default slice.reducer;
