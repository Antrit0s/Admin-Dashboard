import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  avatar?: string;
}
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: getInitialUser(),
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken),
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
