
import { API_ENDPOINTS } from "../api/api-endpoints";
import axiosInstance from "../api/axiosInstance";

export const projectService = {


  getAllProjects: async () => {
    const res = await axiosInstance.get(API_ENDPOINTS.PROJECTS.GET_ALL);
    return res.data;
  },

  getProjectLayers: async (projectId: number | string) => {
    const res = await axiosInstance.get(API_ENDPOINTS.PROJECTS.GET_LAYERS(projectId));
    return res.data;
  },
  
  toggleLayer: async (projectId: number | string, layerCode: string, isenabled: boolean) => {
    const res = await axiosInstance.patch(
      API_ENDPOINTS.PROJECTS.TOGGLE_LAYER(projectId, layerCode),
      { isenabled }
    );
    return res.data;
  },
};