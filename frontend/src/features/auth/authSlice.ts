import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { User, ApiErrorBody } from "../../types";
import type { AxiosError } from "axios";

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}
const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { token: string; user: User }, // Return
  { email: string; password: string }, // Arg
  { rejectValue: string } // Reject
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/users/login", credentials);
    localStorage.setItem("token", data.token);
    return data as { token: string; user: User };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "Login fallido";
    return rejectWithValue(msg);
  }
});

export const me = createAsyncThunk<
  { user: User }, // Return
  void, // Arg
  { rejectValue: string }
>("auth/me", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/users/me");
    return data as { user: User };
  } catch (err) {
    const e = err as AxiosError<ApiErrorBody>;
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      "Sesión inválida";
    return rejectWithValue(msg);
  }
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? "Login fallido";
      })

      .addCase(me.fulfilled, (s, a) => {
        s.user = a.payload.user;
      })
      .addCase(me.rejected, (s, a) => {
        s.token = null;
        s.user = null;
        s.error = a.payload ?? "Sesión inválida";
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
