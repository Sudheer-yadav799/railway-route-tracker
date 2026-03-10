import { API_ENDPOINTS } from "../api/api-endpoints";
import axiosInstance from "../api/axiosInstance";

export const projectService = {

  getAllProjects: async () => {
    const res = await axiosInstance.get(API_ENDPOINTS.PROJECTS.GET_ALL);
    return res.data;
  },

  getProjectById: async (projectId: number | string) => {
    const res = await axiosInstance.get(
      API_ENDPOINTS.PROJECTS.GET_BY_ID(projectId)
    );
    return res.data;
  },

  createProject: async (data: any) => {
    const res = await axiosInstance.post(
      API_ENDPOINTS.PROJECTS.CREATE,
      data
    );
    return res.data;
  },


  updateProject: async ({ projectId, data }: any) => {
  const res = await axiosInstance.patch(
    API_ENDPOINTS.PROJECTS.UPDATE_PROJECT_BY_ID(projectId),
    data
  );

  return res.data;
},

  deleteProject: async (projectId: number | string) => {
    const res = await axiosInstance.delete(
      API_ENDPOINTS.PROJECTS.DELETE(projectId)
    );
    return res.data;
  },

  getProjectLayers: async (projectId: number | string) => {
    const res = await axiosInstance.get(
      API_ENDPOINTS.PROJECTS.GET_LAYERS(projectId)
    );
    return res.data;
  },

  toggleLayer: async (
    projectId: number | string,
    layerCode: string,
    isenabled: boolean
  ) => {
    const res = await axiosInstance.patch(
      API_ENDPOINTS.PROJECTS.TOGGLE_LAYER(projectId, layerCode),
      { isenabled }
    );
    return res.data;
  },
};