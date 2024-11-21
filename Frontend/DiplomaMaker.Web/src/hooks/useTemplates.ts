/*
    UseTemplates

    Extension of useEntity<Template> that adds endpoints beyond base CRUD.
*/

import { BackendService } from "@/services/backendService";
import { Template } from "@/services/backendService/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTemplates() {
  const client = useQueryClient();
  const queryKey = ["Template"];
  const controller = "Template";

  const getTemplatesQuery = useQuery({
    queryKey,
    queryFn: async () => [],
  });

  const templates = (getTemplatesQuery.data ?? []) as Template[];

  const peekTemplatesQuery = useQuery({
    queryKey,
    queryFn: async () => await BackendService.Endpoints.peekTemplates(),
  });

  const getTemplateMutation = useMutation({
    mutationFn: async (guid: string) =>
      (await BackendService.Endpoints.GetEntity(controller, guid)) as Template,
    onSuccess: (response: Template) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
  });

  const postTemplateMutation = useMutation({
    mutationFn: async (entity: Template) =>
      await BackendService.Endpoints.PostEntity(controller, entity),
    onSuccess: (response) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
  });

  const putTemplateMutation = useMutation({
    mutationFn: async (entity: Template) =>
      await BackendService.Endpoints.PutEntity(controller, entity),
    onSuccess: (response) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
    onError: (error) => console.log(error),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (guid: string) =>
      await BackendService.Endpoints.DeleteEntity(controller, guid),
    onSuccess: (_, guid) => {
      deleteTemplateFromCache(guid);
      peekTemplatesQuery.refetch();
    },
    onError: (error) => console.error(error),
  });

  const templateByGuid = (guid: string) => {
    const template = templates.find((entity) => entity.guid == guid);

    if (template) return template;

    if (getTemplateMutation.status != "pending")
      getTemplateMutation.mutate(guid);
  };

  const updateCacheWith = (entity: Template) => {
    client.setQueryData(
      queryKey,
      [
        ...templates.filter(
          (existingEntity) => existingEntity.guid != entity.guid,
        ),
        entity,
      ],
    );
  };

  const deleteTemplateFromCache = (guid: string) => {
    client.setQueryData(
      queryKey,
      [...templates.filter((entity) => entity.guid != guid)],
    );
  };

  return {
    templates,
    templatePeeks: peekTemplatesQuery.data,
    peekTemplates: peekTemplatesQuery.refetch,
    postTemplate: (template: Template) => postTemplateMutation.mutate(template),
    putTemplate: (template: Template) => putTemplateMutation.mutate(template),
    deleteTemplate: (guid: string) => deleteTemplateMutation.mutate(guid),
    templateByGuid,
  };
}
