import { FontService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useFonts() {
  return useQuery({
    queryKey: ["fonts"],
    queryFn: FontService.getSavedFonts,
    staleTime: Infinity,
  });
}
