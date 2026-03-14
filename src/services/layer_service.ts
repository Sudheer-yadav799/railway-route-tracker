import { API_ENDPOINTS } from "../api/api-endpoints";
import axiosInstance from "../api/axiosInstance";




export const layerService = {

  getLayers: async () => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.LAYERS.GET_LAYERS
    );

    return response.data;
  },

  // ─────────────────────────
  // PROJECT LAYERS
  // ─────────────────────────
getLayersByProjectId: async (projectIds?: number | number[] | string) => {

  const params: Record<string, any> = {};

  if (Array.isArray(projectIds) && projectIds.length > 0) {
    params.project_id = projectIds.join(",");
  } 
  else if (typeof projectIds === "number") {
    params.project_id = projectIds;
  }
  else if (typeof projectIds === "string" && projectIds) {
    params.project_id = projectIds;
  }

  const response = await axiosInstance.get(
    API_ENDPOINTS.LAYERS.GET_LAYERS,
    { params }
  );

  return response.data;
},
  createLayer: async (data: any) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.LAYERS.CREATE_LAYER,
      data
    );
    return response.data;
  },


  // ─────────────────────────────────
  // UPDATE LAYER
  // ─────────────────────────────────
  updateLayer: async ({ layerId, data }: any) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.LAYERS.UPDATE_LAYER(layerId),
      data
    );
    return response.data;
  },

  // ─────────────────────────────────
  // DELETE LAYER 
  // ─────────────────────────────────
  deleteLayer: async (layerId: number | string) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.LAYERS.DELETE_LAYER(layerId)
    );
    return response.data;
  },
};

