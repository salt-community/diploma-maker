/*
    UseTemplates
*/

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BackendService, BackendTypes } from "@/services";

export function useTemplates() {
  const queryKeyTemplate = ["Template"];
  const queryKeyTemplatePeek = ["TemplatePeek"];
  const controller = "Template";
  type TEntity = BackendTypes.Template;

  const client = useQueryClient();

  const getTemplatesQuery = useQuery({
    queryKey: queryKeyTemplate,
    queryFn: async () => [],
  });

  const templates = (getTemplatesQuery.data ?? []) as TEntity[];

  const peekTemplatesQuery = useQuery({
    queryKey: queryKeyTemplatePeek,
    queryFn: async () => await BackendService.peekTemplates(),
  });


  const getTemplateMutation = useMutation({
    mutationFn: async (guid: string) =>
      (await BackendService.getEntity(controller, guid)) as TEntity,
    onSuccess: (response: TEntity) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
  });

  const postTemplateMutation = useMutation({
    mutationFn: async (entity: TEntity) =>
      await BackendService.postEntity(controller, entity),
    onSuccess: (response) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
  });

  const putTemplateMutation = useMutation({
    mutationFn: async (entity: TEntity) =>
      await BackendService.putEntity(controller, entity),
    onSuccess: (response) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
    onError: (error) => console.log(error),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (guid: string) =>
      await BackendService.deleteEntity(controller, guid),
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

  const updateCacheWith = (entity: TEntity) => {
    client.setQueryData(
      queryKeyTemplate,
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
      queryKeyTemplate,
      [...templates.filter((entity) => entity.guid != guid)],
    );
  };

  return {
    templates,
    templatePeeks: peekTemplatesQuery.data,
    peekTemplates: peekTemplatesQuery.refetch,
    postTemplate: (template: TEntity) => postTemplateMutation.mutate(template),
    putTemplate: (template: TEntity) => putTemplateMutation.mutate(template),
    deleteTemplate: (guid: string) => deleteTemplateMutation.mutate(guid),
    templateByGuid
  };
}
