export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
  },
  USERS: {
    CREATE: "/api/users/createuser",
    GET_ALL: "/api/users/getallusers",
    GET_BY_ID: (id: string) => `/api/users/get-id-by-userdetails/${id}`,
    DELETE_BY_ID: (id: string | number, deletedById: string | number) => `/api/users/delete-by-id/${id}/${deletedById}`,
  },
  LAYERS: {
    GET_LAYERS: "/api/layers/get-layers",
    GET_LAYERS_BY_ID: (projectId: number | string) => `/api/layers/get-layers/${projectId}`,
    CREATE_LAYER: "/api/create-layers",
    UPDATE_LAYER: (layerId: number | string) => `/api/layers/update-layers/${layerId}`,
    DELETE_LAYER: (layerId: number | string) => `/api/layers/delete-layers/${layerId}`,
  },
  PROJECTS: {
    GET_ALL: "/api/projects/get-all-projects",
    CREATE: "/api/projects/create-project",
    GET_BY_ID: (projectId: number | string) => `/api/projects/get-project/${projectId}`,
    DELETE: (projectId: number | string) => `/api/projects/delete-project/${projectId}`,
    GET_LAYERS: (projectId: number | string) => `/api/projects/layers/${projectId}`,
    TOGGLE_LAYER: (projectId: number | string, layerCode: string) =>`/api/projects/${projectId}/layers/${layerCode}`,
  },
  USER_PROJECTS: {
    ASSIGN: "/api/assignproject/assign-project",
    REMOVE: "/api/assignproject/remove-project",
    GET_BY_USER: (userId?: number | string) =>
      `/api/assignproject/get-assigned-projects/${userId}`,
    GET_BY_PROJECT_USERS: (projectId?: number | string) =>
      `/api/assignproject/project-users/${projectId}`,
     GET_USERS_WITH_PROJECTS: "/api/assignproject/users-projects",
    GET_PROJECTS_BY_USER_ID: (userId?: number | string) => `/api/assignproject/user-projects/${userId}`,
  },
};
