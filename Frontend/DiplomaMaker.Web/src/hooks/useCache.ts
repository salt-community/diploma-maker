import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useCache<T>(cacheKey: string[]) {
    const client = useQueryClient();

    useQuery({
        queryKey: cacheKey,
        queryFn: () => null as T | null
    });

    const entity = client.getQueryData(cacheKey) as T | null;
    const set = (entity: T) => client.setQueryData(cacheKey, entity);

    return [
        entity,
        set
    ] as [T, (entity: T) => void];
}