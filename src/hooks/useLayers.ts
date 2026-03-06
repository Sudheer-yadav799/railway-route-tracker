import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { layerService }   from "../services/layer_service";
import { projectService } from "../services/project_service";



export const useLayers = () => {
  return useQuery({
    queryKey: ["layers"],
    queryFn: layerService.getLayers,
  });
};



export const useUserProjectLayers = (projectIds?: number[]) => {

   console.log("useUserProjectLayers",projectIds);
  return useQuery({
    queryKey: ["project-layers", projectIds],

    queryFn: () => layerService.getLayersByProjectId(projectIds),

    enabled: Array.isArray(projectIds) && projectIds.length > 0
  });

};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn:  projectService.getAllProjects,
  });
};


export const useProjectLayers = (projectId: number | string | null) => {
  return useQuery({
    queryKey: ["project-layers", projectId],
    queryFn:  () => projectService.getProjectLayers(projectId!),
    enabled:  !!projectId,
  });
};


export const useToggleLayer = (projectId: number | string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ layerCode, isenabled }: { layerCode: string; isenabled: boolean }) =>
      projectService.toggleLayer(projectId, layerCode, isenabled),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project-layers", projectId] });
    },
  });
};





export const useCreateLayer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: layerService.createLayer,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["layers"] });
    },
  });
};


export const useUpdateLayer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: layerService.updateLayer,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["layers"] });
    },
  });
};

export const useDeleteLayer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: layerService.deleteLayer,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["layers"] });
    },
  });
};