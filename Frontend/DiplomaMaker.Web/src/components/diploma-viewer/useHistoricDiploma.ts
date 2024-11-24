/*
    useHistoricDiploma

    Corresponds to the HistoricDiplomaController in backend.
*/

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BackendService, BackendTypes } from "@/services";
import { useEntity } from "@/hooks/useEntity";

export function useHistoricDiploma() {
    const client = useQueryClient();

    const queryKey = ["HistoricDiploma"];

    const { entities: diplomas } = useEntity<BackendTypes.DiplomaRecord>("DiplomaRecord", true);

    const historicDiplomaQuery = useQuery({
        queryKey,
        queryFn: () => [] as BackendTypes.HistoricDiploma[]
    });

    const historicDiplomas = historicDiplomaQuery.data as BackendTypes.HistoricDiploma[];

    const getHistoricDiplomaMutation = useMutation({
        mutationFn: async (guid: string) => await BackendService.getHistoricDiplomaByGuid(guid) as BackendTypes.HistoricDiploma,
        onSuccess: (response: BackendTypes.HistoricDiploma) => updateCacheWith(response),
    });

    function getHistoricDiploma(guid: string) {
        console.log(historicDiplomas);
        const existingDiploma = historicDiplomas.find(diploma => diploma.guid == guid);

        if (existingDiploma) return existingDiploma;

        getHistoricDiplomaMutation.mutate(guid);
    }

    function updateCacheWith(historicDiploma: BackendTypes.HistoricDiploma) {
        client.setQueryData(
            queryKey,
            [...historicDiplomas.filter((existingEntity) => existingEntity.guid != historicDiploma.guid), historicDiploma]
        );
    };

    return {
        diplomas,
        getHistoricDiploma: (guid: string) => getHistoricDiploma(guid),
    }
}