import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { layerService }   from "../services/layer_service";
import { projectService } from "../services/project_service";

// ─────────────────────────────────────────
// GET /api/layers/get-layers
// ─────────────────────────────────────────
export const useLayers = () => {
  return useQuery({
    queryKey: ["layers"],
    queryFn:  layerService.getLayers,
  });
};

// ─────────────────────────────────────────
// GET /api/projects/
// ─────────────────────────────────────────
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn:  projectService.getAllProjects,
  });
};

// ─────────────────────────────────────────
// GET /api/projects/layers/:projectId/
// only fetches when projectId is provided
// ─────────────────────────────────────────
export const useProjectLayers = (projectId: number | string | null) => {
  return useQuery({
    queryKey: ["project-layers", projectId],
    queryFn:  () => projectService.getProjectLayers(projectId!),
    enabled:  !!projectId,
  });
};

// ─────────────────────────────────────────
// PATCH /api/projects/:projectId/layers/:layerCode
// auto-refetches project layers after toggle
// ─────────────────────────────────────────
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