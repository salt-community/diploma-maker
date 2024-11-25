import { BackendService } from "@/services/backendService";
import type { BackendTypes } from "@/services/";

import { useQuery } from "@tanstack/react-query";

export default function useTemplate(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => BackendService.getEntity<BackendTypes.Template>("Template", id),
    enabled: !!id,
    staleTime: Infinity,
  });
}
