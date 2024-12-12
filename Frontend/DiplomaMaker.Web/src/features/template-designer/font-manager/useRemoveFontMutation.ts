import { BackendService, BackendTypes, FontTypes } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useRemoveFontMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (font: FontTypes.GoogleFont) =>
      BackendService.postEntity<BackendTypes.Font>(
        "Font",
        font as BackendTypes.Font,
      ),
    onSuccess: () => client.invalidateQueries({ queryKey: ["fonts"] }),
  });
}
