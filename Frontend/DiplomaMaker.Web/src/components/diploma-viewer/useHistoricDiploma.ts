/*
    useHistoricDiploma

    Corresponds to the HistoricDiplomaController in backend.
*/

import { useQuery } from "@tanstack/react-query";

import { BackendService, BackendTypes } from "@/services";

export function useHistoricDiploma(diplomaGuid: string) {
    const queryKey = ["HistoricDiploma", diplomaGuid];

    const historicDiplomaQuery = useQuery({
        queryKey,
        queryFn: async () => await BackendService.getHistoricDiplomaByGuid(diplomaGuid);
    });

    const historicDiploma = historicDiplomaQuery.data as BackendTypes.HistoricDiploma | null;

    return {
        historicDiploma,
    }
}