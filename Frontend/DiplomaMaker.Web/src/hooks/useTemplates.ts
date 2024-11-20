/*
    UseTemplates

    Extension of useEntity<Template> that adds endpoints beyond base CRUD.
*/

import { Template } from "@/api/models";
import useEntity from "./useEntity";
import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "@/api";

export function useTemplates() {
    const templateEntities = useEntity<Template>("Template");

    const peekTemplatesQuery = useQuery({
        queryKey: ["TemplatePeeks"],
        queryFn: async () => await Endpoints.peekTemplates()
    });

    return {
        ...templateEntities,
        templatePeeks: peekTemplatesQuery.data
    }
}