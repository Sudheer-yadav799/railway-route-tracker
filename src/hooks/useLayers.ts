import { useQuery } from "@tanstack/react-query";
import { layerService } from "../services/layer_service";

export const useLayers = () => {
  return useQuery({
    queryKey: ["layers"],
    queryFn: layerService.getLayers,
  });
};