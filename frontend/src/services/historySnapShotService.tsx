import { apiEndpointParameters, HistorySnapshotResponse, MakeActiveSnapshotRequestDto } from "../util/types";
import { getTemplatePdfFile } from "./fileService";

export async function getHistorySnapshots(apiParameters: apiEndpointParameters, setLoadingMessage?: (message: string) => void): Promise<HistorySnapshotResponse[]> {
    setLoadingMessage("Fetching History Snapshots...")
    const response = await fetch(`${apiParameters.endpointUrl}/api/HistorySnapshots`, {
        headers: {'Authorization': `Bearer ${apiParameters.token()}` }
    });
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(`Failed to get HistorySnapshots! ${errorData}`)
    }

    const results = await response.json() as HistorySnapshotResponse[]

    
    for (const result of results) {
        result.basePdfName = result.basePdf;
        result.basePdf = await getTemplatePdfFile(apiParameters, result.basePdf, result.templateLastUpdated);
    }

    return results;
}

export async function getHistoryByVerificationCode(apiParameters: apiEndpointParameters, verificationCode: string): Promise<HistorySnapshotResponse[]> {
    const response = await fetch(`${apiParameters.endpointUrl}/api/HistorySnapshots/${verificationCode}`, {
        headers: {'Authorization': `Bearer ${apiParameters.token()}` }
    });
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(`Failed to get HistorySnapshots! ${errorData}`)
    }

    const results = await response.json() as HistorySnapshotResponse[]

    for (const result of results) {
        result.basePdf = await getTemplatePdfFile(apiParameters, result.basePdf, result.templateLastUpdated);
    }

    return results;
}

export async function makeActiveHistorySnapShot(apiParameters: apiEndpointParameters, request: MakeActiveSnapshotRequestDto): Promise<HistorySnapshotResponse[]> {
    const response = await fetch(`${apiParameters.endpointUrl}/api/make-active-historysnapshot`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiParameters.token()}` 
        },
        body: JSON.stringify(request)
    });
    
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(`Failed to update active status of HistorySnapshot! ${errorData}`);
    }

    const results = await response.json() as HistorySnapshotResponse[];

    for (const result of results) {
        result.basePdf = await getTemplatePdfFile(apiParameters, result.basePdf, result.templateLastUpdated);
    }

    return results;
}