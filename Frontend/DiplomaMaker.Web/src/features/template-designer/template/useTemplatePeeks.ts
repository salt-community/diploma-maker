import { BackendService } from "@/services/backendService";
import { useQuery } from "@tanstack/react-query";

export default function useTemplatePeeks() {
  return useQuery({
    queryKey: ["templatePeeks"],
    queryFn: () => BackendService.peekTemplates(),
    staleTime: Infinity,
  });
}
