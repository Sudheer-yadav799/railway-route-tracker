import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/project_service";
import toast from "react-hot-toast";
import { userProjectService } from "../services/userproject_service";


/* ======================
GET ALL PROJECTS
====================== */

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAllProjects
  });
};


/* ======================
GET PROJECT DETAILS
====================== */

export const useProjectDetails = (projectId?: number | string) => {
  return useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => projectService.getProjectById(projectId),
    enabled: !!projectId
  });
};


/* ======================
CREATE PROJECT
====================== */

export const useCreateProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: projectService.createProject,

    onSuccess: () => {
      toast.success("Project created successfully");

      qc.invalidateQueries({
        queryKey: ["projects"]
      });
    },

    onError: () => {
      toast.error("Failed to create project");
    }
  });
};


/* ======================
DELETE PROJECT
====================== */

export const useDeleteProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number | string) =>
      projectService.deleteProject(projectId),

    onSuccess: () => {
      toast.success("Project deleted successfully");

      qc.invalidateQueries({
        queryKey: ["projects"]
      });
    },

    onError: () => {
      toast.error("Failed to delete project");
    }
  });
};


 /*=========================
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


export const useUsersWithProjects = () => {

  return useQuery({
    queryKey: ["users-projects"],
    queryFn: () =>
      userProjectService.getUsersWithProjects()

  });
}

export const useUserProjectsById = (userId?: number | string) => {
  return useQuery({
    queryKey: ["user-projects_by_id", userId],
    queryFn: () => userProjectService.getProjectUsersById(userId),
    enabled: !!userId
  });
};