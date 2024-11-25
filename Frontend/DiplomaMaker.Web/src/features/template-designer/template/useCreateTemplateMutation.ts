import { BackendService } from "@/services/backendService";
import type { BackendTypes } from "@/services/";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateTemplateMutation(
  onTemplateCreated?: (template: BackendTypes.Template) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: BackendTypes.Template) =>
      BackendService.postEntity<BackendTypes.Template>("Template", template),
    onSuccess: (template) => {
      queryClient.setQueryData(["templates", template.guid], template);
      queryClient.invalidateQueries({ queryKey: ["templatePeeks"] });
      onTemplateCreated?.(template);
    },
  });
}
