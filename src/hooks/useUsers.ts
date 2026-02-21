import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user_service";


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
