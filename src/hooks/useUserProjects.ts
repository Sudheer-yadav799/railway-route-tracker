import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userProjectService } from "../services/userproject_service";


export const useAssignProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => userProjectService.assignProject(data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-projects"] });
    },
  });
};
export const useRemoveProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => userProjectService.removeProject(data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-projects"] });
    },
  });
};
export const useUserProjects = (userId?: number | string) => {
  return useQuery({
    queryKey: ["user-projects", userId],
    queryFn: () => userProjectService.getUserProjects(userId),
    enabled: !!userId,
  });
};

export const useProjectUsers = (projectId?: number | string) => {
  return useQuery({
    queryKey: ["assigned-projects-list", projectId],
    queryFn: () => userProjectService.getProjectUserss(projectId),
    enabled: !!projectId,
  });
};