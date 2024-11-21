import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useSynchronousCache<T>(cacheKey: string) {
    const client = useQueryClient();

    useQuery({
        queryKey: [cacheKey],
        queryFn: () => [] as T
    });

    const getAll = () =>
        client.getQueryData([cacheKey]) as T[];

    const add = (entity: T) =>
        client.setQueryData([cacheKey], [...getAll(), entity]);

    const remove = (entity: T) =>
        client.setQueryData([cacheKey], getAll().filter(e => e != entity));

    const removeAll = () =>
        client.setQueryData([cacheKey], []);

    return {
        getAll,
        add,
        remove,
        removeAll
    };
}