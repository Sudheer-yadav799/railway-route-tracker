import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { layerService } from "../services/layer_service";
import { projectService } from "../services/project_service";

/* -----------------------------
   All Layers
----------------------------- */

export const useLayers = () => {
  return useQuery({
    queryKey: ["layers"],
    queryFn: layerService.getLayers,
  });
};

/* -----------------------------
   Layers by Project IDs
----------------------------- */

export const useUserProjectLayers = (projectIds?: number[]) => {
  return useQuery({
    queryKey: ["user-project-layers", projectIds],

    queryFn: () => layerService.getLayersByProjectId(projectIds),

    enabled: !!projectIds && projectIds.length > 0,

    staleTime: 0,
  });
};

/* -----------------------------
   Projects
----------------------------- */

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAllProjects,
  });
};

/* -----------------------------
   Project Layers
----------------------------- */

export const useProjectLayers = (projectId: number | string | null) => {
  return useQuery({
    queryKey: ["project-layers", projectId],

    queryFn: () => projectService.getProjectLayers(projectId!),

    enabled: !!projectId,
  });
};

/* -----------------------------
   Toggle Layer
----------------------------- */

export const useToggleLayer = (projectId: number | string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      layerCode,
      isenabled,
    }: {
      layerCode: string;
      isenabled: boolean;
    }) => projectService.toggleLayer(projectId, layerCode, isenabled),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project-layers", projectId] });
    },
  });
};

/* -----------------------------
   Create Layer
----------------------------- */

export const useCreateLayer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: layerService.createLayer,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["layers"] });
    },
  });
};

/* -----------------------------
   Update Layer
----------------------------- */

export const useUpdateLayer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: layerService.updateLayer,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["layers"] });
    },
  });
};

/* -----------------------------
   Delete Layer
----------------------------- */

export const useDeleteLayer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: layerService.deleteLayer,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["layers"] });
    },
  });
};