/*
    UseTemplates

    Extension of useEntity<Template> that adds endpoints beyond base CRUD.
*/

import { Endpoints } from "@/api";
import { Template } from "@/api/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTemplates() {
  const client = useQueryClient();

  const getTemplatesQuery = useQuery({
    queryKey: ["Template"],
    queryFn: async () => [],
  });

  const templates = (getTemplatesQuery.data ?? []) as Template[];

  const peekTemplatesQuery = useQuery({
    queryKey: ["TemplatePeeks"],
    queryFn: async () => await Endpoints.peekTemplates(),
  });

  const getTemplateMutation = useMutation({
    mutationFn: async (guid: string) =>
      (await Endpoints.GetEntity("Template", guid)) as Template,
    onSuccess: (response: Template) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
  });

  const postTemplateMutation = useMutation({
    mutationFn: async (entity: Template) =>
      await Endpoints.PostEntity("Template", entity),
    onSuccess: (response) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
  });

  const putTemplateMutation = useMutation({
    mutationFn: async (entity: Template) =>
      await Endpoints.PutEntity("Template", entity),
    onSuccess: (response) => {
      updateCacheWith(response);
      peekTemplatesQuery.refetch();
    },
    onError: (error) => console.log(error),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (guid: string) =>
      await Endpoints.DeleteEntity("Template", guid),
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
      ["Template"],
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
      ["Template"],
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
