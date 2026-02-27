import { API_ENDPOINTS } from "../api/api-endpoints";
import axiosInstance from "../api/axiosInstance";


export const userService = {
  createUser: async (data: any) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.USERS.CREATE,
      data
    );
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.USERS.GET_ALL
    );
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.USERS.GET_BY_ID(id)
    );
    return response.data;
  },
  deleteUserById: async ({id,deletedById,}: { id: number | string; deletedById: number | string; }) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.USERS.DELETE_BY_ID(id, deletedById)
    );
    return response.data;
  },
};
