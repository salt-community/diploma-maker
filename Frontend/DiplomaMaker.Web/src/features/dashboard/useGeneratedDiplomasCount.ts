import { BackendService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export default function useGeneratedDiplomasCount() {
  return useQuery({
    queryKey: ["historicDiplomasCount"],
    queryFn: BackendService.getHistoricDiplomasCount,
  });
}
