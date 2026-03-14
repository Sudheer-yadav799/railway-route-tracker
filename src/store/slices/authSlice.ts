import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Role {
  id: number;
  name: string;
  description: string;
}

interface Projects{
  id :number;
  name : string;
 map_view_center :string;
}

interface User {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  is_active: boolean;
  Roles: Role[];
  // project: Projects[];
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("projectIds");
    }

  }
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;