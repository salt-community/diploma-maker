import { useQuery } from "@tanstack/react-query";

import { FontService } from "@/services";

export function useGoogleFonts() {
  return useQuery({
    queryKey: ["google_fonts"],
    queryFn: FontService.fetchGoogleFonts,
    staleTime: Infinity,
  });
}
