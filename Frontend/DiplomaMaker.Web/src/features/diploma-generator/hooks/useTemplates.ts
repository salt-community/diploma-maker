import { BackendService, BackendTypes } from "@/services";
import { useQuery } from "@tanstack/react-query";

export default function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () =>
      await BackendService.getEntities<BackendTypes.Template>("Template"),
  });
}
