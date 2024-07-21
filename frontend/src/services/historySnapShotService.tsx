import { HistorySnapshotResponse } from "../util/types";
import { getTemplatePdfFile } from "./fileService";

export async function getHistorySnapshots(apiUrl: string): Promise<HistorySnapshotResponse[]> {
    const response = await fetch(`${apiUrl}/api/HistorySnapshots`);
    if (!response.ok){
        const errorData = await response.json();
        throw new Error(`Failed to get HistorySnapshots! ${errorData}`)
    }

    const results = await response.json() as HistorySnapshotResponse[]

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