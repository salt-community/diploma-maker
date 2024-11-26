import { BackendService } from "@/services/backendService";
import type { BackendTypes } from "@/services/";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: BackendTypes.Template) =>
      BackendService.putEntity("Template", template),
    onSuccess: (template) => {
      queryClient.setQueryData(["templates", template.guid], template);

      // Updates the template name in the templatePeeks list
      queryClient.setQueryData(
        ["templatePeeks"],
        (old: BackendTypes.TemplatePeek[]) =>
          old.map((peek) =>
            peek.guid === template.guid
              ? { ...peek, name: template.name }
              : peek,
          ),
      );
    },
  });
}
