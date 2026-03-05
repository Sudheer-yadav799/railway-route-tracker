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
     DELETE_BY_ID: (id: string | number, deletedById: string | number) =>  `/api/users/delete-by-id/${id}/${deletedById}`,
  },
   LAYERS: {
    GET_LAYERS: "/api/layers/get-layers",
  },
   PROJECTS: {
    GET_ALL:         "/api/projects",
    GET_LAYERS:      (projectId: number | string) => `/api/projects/layers/${projectId}/`,
    TOGGLE_LAYER:    (projectId: number | string, layerCode: string) => `/api/projects/${projectId}/layers/${layerCode}`,
  },
  USER_PROJECTS: {
  ASSIGN: "/api/assignproject/assign-project",
  REMOVE: "/api/assignproject/remove-project",
  GET_BY_USER: (userId?: number | string) =>
    `/api/assignproject/get-assigned-projects/${userId}`,
   GET_BY_PROJECT_USERS: (projectId?: number | string) =>
    `/api/assignproject/project-users/${projectId}`,
},
};
