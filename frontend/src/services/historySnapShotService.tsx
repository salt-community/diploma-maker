import { HistorySnapshotResponse, MakeActiveSnapshotRequestDto } from "../util/types";
import { getTemplatePdfFile } from "./fileService";

export async function getHistorySnapshots(apiUrl: string, setLoadingMessage?: (message: string) => void): Promise<HistorySnapshotResponse[]> {
    setLoadingMessage("Fetching History Snapshots...")
    const response = await fetch(`${apiUrl}/api/HistorySnapshots`);
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(`Failed to get HistorySnapshots! ${errorData}`)
    }

    const results = await response.json() as HistorySnapshotResponse[]

    
    for (const result of results) {
        result.basePdfName = result.basePdf;
        result.basePdf = await getTemplatePdfFile(apiUrl, result.basePdf, result.templateLastUpdated);
    }

    return results;
}

export async function getHistoryByVerificationCode(apiUrl: string, verificationCode: string): Promise<HistorySnapshotResponse[]> {
    const response = await fetch(`${apiUrl}/api/HistorySnapshots/${verificationCode}`);
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(`Failed to get HistorySnapshots! ${errorData}`)
    }

    const results = await response.json() as HistorySnapshotResponse[]

    for (const result of results) {
        result.basePdf = await getTemplatePdfFile(apiUrl, result.basePdf, result.templateLastUpdated);
    }

    return results;
}

export async function makeActiveHistorySnapShot(apiUrl: string, request: MakeActiveSnapshotRequestDto): Promise<HistorySnapshotResponse[]> {
    const response = await fetch(`${apiUrl}/api/make-active-historysnapshot`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });
    
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(`Failed to update active status of HistorySnapshot! ${errorData}`);
    }

    const results = await response.json() as HistorySnapshotResponse[];

    for (const result of results) {
        result.basePdf = await getTemplatePdfFile(apiUrl, result.basePdf, result.templateLastUpdated);
    }

    return results;
}