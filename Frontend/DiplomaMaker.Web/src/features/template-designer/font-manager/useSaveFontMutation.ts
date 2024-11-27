import { FontService, FontTypes } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useSaveFontMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (font: FontTypes.GoogleFont) => FontService.saveFont(font),
    onSuccess: () => client.invalidateQueries({ queryKey: ["fonts"] }),
  });
}
