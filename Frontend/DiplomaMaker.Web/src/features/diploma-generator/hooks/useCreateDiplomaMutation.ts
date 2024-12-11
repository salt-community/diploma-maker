import { BackendService, BackendTypes } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateDiplomaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (diploma: BackendTypes.DiplomaRecord) =>
      BackendService.postEntity<BackendTypes.DiplomaRecord>(
        "DiplomaRecord",
        diploma,
      ),
    onSuccess: (diploma) => {
      queryClient.setQueryData(["diplomas", diploma.guid], diploma);
    },
  });
}
