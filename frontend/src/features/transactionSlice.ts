import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { Transaction } from '../types/types';

interface TransactionState {
  history: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchHistory = createAsyncThunk<{ transactions: Transaction[] }, void, { rejectValue: string }>(
  'wallet/history', async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/wallet/history');
      return data.data; // { transactions: [...] }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al cargar historial');
    }
});

export const processTransaction = createAsyncThunk<
  any, 
  { type: 'deposit' | 'withdraw' | 'transfer', payload: any }, 
  { rejectValue: string }
>('wallet/process', async ({ type, payload }, { rejectWithValue }) => {
    try {
      // Mapea a /wallet/deposit, /wallet/withdraw o /wallet/transfer
      const { data } = await api.post(`/wallet/${type}`, payload);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error en la operación');
    }
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.transactions;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: any) => { state.loading = false; state.error = action.payload as string; }
      );
  },
});

export default transactionSlice.reducer;