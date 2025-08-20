import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
  role: "User" | "Admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const loadAuth = (): AuthState => {
  try {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : { user: null, token: null };
  } catch (err) {
    console.error("Failed to parse auth from localStorage", err);
    return { user: null, token: null };
  }
};

const initialState: AuthState = loadAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
    //   console.log(action.payload.token);
      state.token = action.payload.token;
      localStorage.setItem("auth", JSON.stringify(state));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
