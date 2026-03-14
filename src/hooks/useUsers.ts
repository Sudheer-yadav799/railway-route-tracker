import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user_service";

import toast from "react-hot-toast";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getAllUsers,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};


export const useCreateUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,

    onSuccess: (data: any) => {
      toast.success(
        data?.message || "User created successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create user"
      );
    },
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUserById,

    onSuccess: (data: any) => {
      toast.success(data?.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete user"
      );
    },
  });
};

export const useUserSessions = () => {
  return useQuery({
    queryKey: ["user-sessions"],
    queryFn: () => userService.getAllUsersSeassion(),
    staleTime: 60000
  });
};