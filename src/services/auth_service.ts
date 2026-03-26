import { API_ENDPOINTS } from "../api/api-endpoints";
import axiosInstance from "../api/axiosInstance";

/* -------- Types -------- */

export interface LoginPayload {
  user_id: string; // mobile or email
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  success: boolean;
  userId? :string;
  message?: string;
}

/* -------- Service -------- */

export const authService = {
  register: async (data: any) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data;
  },
};
