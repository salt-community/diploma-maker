/*
    UseEntity

    Generic hook for working with CRUD entities on the backend.
    Responsible for managing cache for a particular entity.
*/

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BackendService, BackendTypes } from "@/services";

export function useEntity<TEntity extends BackendTypes.Dto>(controller: BackendTypes.ControllerName) {
    const client = useQueryClient();

    const getAllEntitiesQuery = useQuery({
        queryKey: [controller],
        queryFn: async () => [],
    });

    const entities = (getAllEntitiesQuery.data ?? []) as TEntity[];

    const getAllEntitiesMutation = useMutation({
        mutationFn: async () => await BackendService.getEntities<TEntity>(controller),
        onSuccess: (entities: TEntity[]) => client.setQueryData([controller], entities),
    });

    const getEntitiesByGuidsMutation = useMutation({
        mutationFn: async (guids: string[]) => await BackendService.getEntitiesByGuids<TEntity>(controller, guids),
        onSuccess: (entities: TEntity[]) => updateCacheWithMany(entities)
    });

    const getEntityMutation = useMutation({
        mutationFn: async (guid: string) => await BackendService.getEntity(controller, guid) as TEntity,
        onSuccess: (response: TEntity) => updateCacheWith(response)
    });

    const postEntityMutation = useMutation({
        mutationFn: async (entity: TEntity) => await BackendService.postEntity(controller, entity),
        onSuccess: (response) => updateCacheWith(response)
    });

    const putEntityMutation = useMutation({
        mutationFn: async (entity: TEntity) => await BackendService.putEntity(controller, entity),
        onSuccess: (response) => updateCacheWith(response),
        onError: (error) => console.log(error)
    });

    const deleteEntityMutation = useMutation({
        mutationFn: async (guid: string) => await BackendService.deleteEntity(controller, guid),
        onSuccess: (_, guid) => deleteEntityFromCache(guid),
        onError: (error) => console.error(error)
    });

    const updateCacheWith = (entity: TEntity) => {
        client.setQueryData(
            [controller],
            [...entities.filter((existingEntity) => existingEntity.guid != entity.guid), entity]
        );
    };

    const updateCacheWithMany = (entities: TEntity[]) => {
        const existingEntities = entities.filter((existingEntity) => !entities.includes(existingEntity));
        client.setQueryData([controller], [...existingEntities, entities]);
    }

    const deleteEntityFromCache = (guid: string) => {
        client.setQueryData(
            [controller],
            [...entities.filter((entity) => entity.guid != guid)]
        );
    };

    const entityByGuid = (guid: string) => {
        const entity = entities.find((entity) => entity.guid == guid);

        if (entity) return entity;

        if (getEntityMutation.status != "pending") getEntityMutation.mutate(guid);
    };

    return {
        entities,
        getAllEntities: () => getAllEntitiesMutation.mutate(),
        getEntitiesByGuids: (guids: string[]) => getEntitiesByGuidsMutation.mutate(guids),
        postEntity: (entity: TEntity) =>
            postEntityMutation.mutate(entity),
        putEntity: (entity: TEntity) =>
            putEntityMutation.mutate(entity),
        entityByGuid: entityByGuid,
        deleteEntity: (guid: string) =>
            deleteEntityMutation.mutate(guid)
    }
}