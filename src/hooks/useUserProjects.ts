import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userProjectService } from "../services/userproject_service";
import toast from "react-hot-toast";


/* ======================
ASSIGN PROJECT
====================== */

export const useAssignProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => userProjectService.assignProject(data),

    onSuccess: () => {
      toast.success("User assigned successfully");

      qc.invalidateQueries({
        queryKey: ["assigned-projects-list"]
      });
    },

    onError: () => {
      toast.error("Failed to assign project");
    }
  });
};

/* ======================
REMOVE PROJECT
====================== */

export const useRemoveProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => userProjectService.removeProject(data),

    onSuccess: () => {
      toast.success("User removed successfully");

      qc.invalidateQueries({
        queryKey: ["assigned-projects-list"]
      });
    },

    onError: () => {
      toast.error("Failed to remove project");
    }
  });
};

/* ======================
USER PROJECTS
====================== */

export const useUserProjects = (userId?: number | string) => {
  return useQuery({
    queryKey: ["user-projects", userId],
    queryFn: () => userProjectService.getUserProjects(userId),
    enabled: !!userId
  });
};

/* ======================
PROJECT USERS
====================== */

export const useProjectUsers = (projectId?: number | string) => {
  return useQuery({
    queryKey: ["assigned-projects-list", projectId],
    queryFn: () => userProjectService.getProjectUserss(projectId),
    enabled: !!projectId
  });
};