import { API_ENDPOINTS } from "../api/api-endpoints";
import axiosInstance from "../api/axiosInstance";




export const layerService = {
  getLayers: async () => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.LAYERS.GET_LAYERS
    );
    return response.data;
  },
};