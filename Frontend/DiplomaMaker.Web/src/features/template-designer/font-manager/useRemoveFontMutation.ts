import { FontService, FontTypes } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useRemoveFontMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (font: FontTypes.GoogleFont) => FontService.removeFont(font),
    onSuccess: () => client.invalidateQueries({ queryKey: ["fonts"] }),
  });
}
