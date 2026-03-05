import { API_ENDPOINTS } from "../api/api-endpoints";
import axiosInstance from "../api/axiosInstance";

export const userProjectService = {

  assignProject: async (data: {
    user_id: number;
    project_id: number;
    assigned_by: number;
  }) => {
    const res = await axiosInstance.post(
      API_ENDPOINTS.USER_PROJECTS.ASSIGN,
      data
    );
    return res.data;
  },

  removeProject: async (data: {
    user_id: number;
    project_id: number;
    removed_by: number;
  }) => {
    const res = await axiosInstance.post(
      API_ENDPOINTS.USER_PROJECTS.REMOVE,
      data
    );
    return res.data;
  },

  getUserProjects: async (userId?: number | string) => {
    const res = await axiosInstance.get(
      API_ENDPOINTS.USER_PROJECTS.GET_BY_USER(userId)
    );
    return res.data;
  },
  getProjectUserss: async (projectId?: number | string) => {
    const res = await axiosInstance.get(
      API_ENDPOINTS.USER_PROJECTS.GET_BY_PROJECT_USERS(projectId)
    );
    return res.data;
  },


};