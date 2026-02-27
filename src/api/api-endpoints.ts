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
  },
   LAYERS: {
    GET_LAYERS: "/api/layers/get-layers",
  },
};
