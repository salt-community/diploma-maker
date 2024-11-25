import { BackendService } from "@/services/backendService";
import { Template } from "@/services/backendService/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateTemplateMutation(
  onTemplateCreated?: (template: Template) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: Template) =>
      BackendService.Endpoints.PostEntity<Template>("Template", template),
    onSuccess: (template) => {
      queryClient.setQueryData(["templates", template.guid], template);
      queryClient.invalidateQueries({ queryKey: ["templatePeeks"] });
      onTemplateCreated?.(template);
    },
  });
}
