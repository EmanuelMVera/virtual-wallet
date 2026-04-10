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
  'wallet/history',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/wallet/history');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al cargar historial');
    }
  }
);

export const deposit = createAsyncThunk<any, number, { rejectValue: string }>(
  'wallet/deposit',
  async (amount, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/wallet/deposit', { amount });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error en depósito');
    }
  }
);

export const withdraw = createAsyncThunk<any, number, { rejectValue: string }>(
  'wallet/withdraw',
  async (amount, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/wallet/withdraw', { amount });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error en retiro');
    }
  }
);

export const transfer = createAsyncThunk<any, { targetAlias: string; amount: number }, { rejectValue: string }>(
  'wallet/transfer',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/wallet/transfer', payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error en transferencia');
    }
  }
);

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
        (action) => action.type.startsWith('wallet/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('wallet/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('wallet/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default transactionSlice.reducer;
