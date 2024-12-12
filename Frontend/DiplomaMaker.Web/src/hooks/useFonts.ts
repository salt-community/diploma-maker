import { BackendService, BackendTypes } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useFonts() {
  return useQuery({
    queryKey: ["fonts"],
    queryFn: () => BackendService.getEntities<BackendTypes.Font>("Font"),
    staleTime: Infinity,
  });
}
