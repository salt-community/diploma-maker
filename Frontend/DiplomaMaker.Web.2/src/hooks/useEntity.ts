/*
    UseEntity

    Generic hook for working with CRUD entities on the backend.
*/

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ControllerName, Dto, Endpoints } from "../fetchApi";

export default function useEntity<TEntity extends Dto>(controller: ControllerName) {
    const client = useQueryClient();

    const getAllEntitiesQuery = useQuery({
        queryKey: [controller],
        queryFn: async () => await Endpoints.GetEntities<TEntity>(controller),
    });

    const entities = getAllEntitiesQuery.data ?? [];

    const getEntityMutation = useMutation({
        mutationFn: async (guid: string) => await Endpoints.GetEntity(controller, guid) as TEntity,
        onSuccess: (response: TEntity) => updateCacheWith(response)
    });

    const postEntityMutation = useMutation({
        mutationFn: async (entity: TEntity) => await Endpoints.PostEntity(controller, entity),
        onSuccess: (response) => updateCacheWith(response)
    });

    const putEntityMutation = useMutation({
        mutationFn: async (entity: TEntity) => await Endpoints.PutEntity(controller, entity),
        onSuccess: (response) => updateCacheWith(response)
    });

    const deleteEntityMutation = useMutation({
        mutationFn: async (guid: string) => await Endpoints.DeleteEntity(controller, guid),
        onSuccess: (_, guid) => deleteEntityFromCache(guid),
        onError: (error) => console.error(error)
    });

    const updateCacheWith = (entity: TEntity) => {
        client.setQueryData(
            [controller],
            [...entities.filter((existingEntity) => existingEntity.guid != entity.guid), entity]
        );
    };

    const deleteEntityFromCache = (guid: string) => {
        client.setQueryData(
            [controller],
            [...entities.filter((entity) => entity.guid != guid)]
        );
    };

    //TODO: this causes infinite recursion in react rerenders
    const entityByGuid = (guid: string) => {
        const entity = entities.find((entity) => entity.guid == guid);

        if (entity) return entity;

        getEntityMutation.mutate(guid);
    };

    return {
        entities,
        postEntity: (entity: TEntity) =>
            postEntityMutation.mutate(entity),
        putEntity: (entity: TEntity) =>
            putEntityMutation.mutate(entity),
        entityByGuid: entityByGuid,
        deleteEntity: (guid: string) =>
            deleteEntityMutation.mutate(guid)
    }
}