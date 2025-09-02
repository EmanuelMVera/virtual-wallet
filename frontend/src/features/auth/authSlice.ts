import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { User } from "../../types";

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

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const { data } = await api.post("/users/login", credentials);
      // Esperado: { token, user }
      localStorage.setItem("token", data.token);
      return data as { token: string; user: User };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message ?? "Login fallido"
      );
    }
  }
);

export const me = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/users/me");
    return data as { user: User };
  } catch {
    return thunkAPI.rejectWithValue("Sesión inválida");
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
        s.error = a.payload as string;
      })
      .addCase(me.fulfilled, (s, a) => {
        s.user = a.payload.user;
      })
      .addCase(me.rejected, (s) => {
        s.token = null;
        s.user = null;
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
