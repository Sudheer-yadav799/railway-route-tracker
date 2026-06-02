import axios, { AxiosError } from "axios";

/* --------------------------------------------
   Create Axios Instance
--------------------------------------------- */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,   
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});


/* --------------------------------------------
   Request Interceptor
--------------------------------------------- */

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* --------------------------------------------
   Response Interceptor
--------------------------------------------- */

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    /* Network Error */
    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your internet connection.")
      );
    }

    const { status, data } = error.response;

    /* Unauthorized */
 if (status === 401 || status === 403) {
  localStorage.removeItem("token");
  localStorage.clear();

  window.location.replace("/");

  return Promise.reject(
    new Error("Session expired. Please login again.")
  );
}

    /* Validation Error */
    if (status === 400 && data?.errors) {
      const fieldErrors: Record<string, string> = {};

      Object.keys(data.errors).forEach((key) => {
        fieldErrors[key] = data.errors[key].join(" ");
      });

      return Promise.reject({
        type: "validation",
        fieldErrors,
        message: data.title || "Validation failed.",
      });
    }

    /* Server Error */
    if (status >= 500) {
      return Promise.reject(
        new Error(
          data?.message ||
            "Server error. Please try again later."
        )
      );
    }

    /* Other Errors */
    return Promise.reject(
      new Error(data?.message || error.message)
    );
  }
);

export default axiosInstance;
