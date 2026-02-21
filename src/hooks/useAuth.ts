import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth_service";


export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
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
