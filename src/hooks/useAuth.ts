import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth_service";
import toast from "react-hot-toast";


export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,

    onMutate: () => {
      toast.loading("Signing in...", { id: "loginToast" });
    },

    onSuccess: (data: any) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);

        toast.success("Login successful 🎉", {
          id: "loginToast",
        });
      } else {
        toast.error("Login failed. No token received.", {
          id: "loginToast",
        });
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      toast.error(message, {
        id: "loginToast",
      });
    },
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};




export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/";
    },
  });
};
