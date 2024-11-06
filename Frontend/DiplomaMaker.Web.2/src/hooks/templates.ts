import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Endpoints } from "../api";
import { TemplatePostRequest, TemplateRequest, TemplateResponse } from "../api/dtos/templates";

export function useTemplates() {
    const client = useQueryClient();

    const getAllTemplatesQuery = useQuery({
        queryKey: ["templates"],
        queryFn: Endpoints.Templates.getTemplates,
    });

    const templates = getAllTemplatesQuery.data ?? [];

    const getTemplateQuery = useMutation({
        mutationFn: async (id: number) => await Endpoints.Templates.getTemplateById(id),
        onSuccess: (templateResponse) => updateTemplateCacheWith(templateResponse)
    })

    const postTemplateQuery = useMutation({
        mutationFn: async (request: TemplatePostRequest) => await Endpoints.Templates.postTemplate(request),
        onSuccess: (templateResponse) => updateTemplateCacheWith(templateResponse)
    });

    const putTemplateQuery = useMutation({
        mutationFn: async ({ id, request }: { id: number, request: TemplateRequest }) => await Endpoints.Templates.putTemplate(id, request),
        onSuccess: (templateResponse) => updateTemplateCacheWith(templateResponse)
    });

    const deleteTemplateMutation = useMutation({
        mutationFn: async (id: number) => await Endpoints.Templates.deleteTemplate(id),
        onSuccess: (_, id) => deleteTemplateFromCache(id)
    })

    const updateTemplateCacheWith = (template: TemplateResponse) => {
        client.setQueryData(
            ["templates"],
            [...templates.filter((template) => template.id != template.id), template]
        );
    }

    const deleteTemplateFromCache = (id: number) => {
        client.setQueryData(
            ["templates"],
            [...templates.filter((template) => template.id != id)]
        );
    }

    const templateById = (id: number) => {
        const template = templates.find((template) => template.id == id);
        if (template) return template;
        getTemplateQuery.mutate(id);
    }

    return {
        templates,
        postTemplate: postTemplateQuery.mutate,
        putTemplate: putTemplateQuery.mutate,
        templateById,
        deleteTemplate: deleteTemplateMutation.mutate
    }
}