import { BackendService } from "@/services/backendService";
import { Template } from "@/services/backendService/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: Template) =>
      BackendService.Endpoints.PutEntity("Template", template),
    onSuccess: (template) => {
      queryClient.setQueryData(["templates", template.guid], template);
    },
  });
}
