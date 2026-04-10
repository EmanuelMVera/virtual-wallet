import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { User, AuthResponse } from '../types/types';

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<AuthResponse, any, { rejectValue: string }>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/login', credentials);
      localStorage.setItem('token', data.token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error en login');
    }
  }
);

export const getMe = createAsyncThunk<{ user: User }, void, { rejectValue: string }>(
  'user/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/me');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al obtener perfil');
    }
  }
);

export const updateProfile = createAsyncThunk<{ user: User }, Partial<User>, { rejectValue: string }>(
  'user/updateProfile',
  async (updateData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/users/profile', updateData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al actualizar');
    }
  }
);

export const updatePassword = createAsyncThunk<{ message: string }, string, { rejectValue: string }>(
  'user/updatePassword',
  async (password, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/users/password', { password });
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error al actualizar contraseña');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
