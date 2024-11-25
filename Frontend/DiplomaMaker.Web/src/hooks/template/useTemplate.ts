import { BackendService } from "@/services/backendService";
import { Template } from "@/services/backendService/models";
import { useQuery } from "@tanstack/react-query";

export default function useTemplate(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => BackendService.Endpoints.GetEntity<Template>("Template", id),
    enabled: !!id,
    staleTime: Infinity,
  });
}
