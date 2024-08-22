import { apiEndpointParameters, TrackResponse } from "../util/types";

export async function getAllTracks(apiParameters: apiEndpointParameters, setLoadingMessage: (message: string) => void): Promise<TrackResponse[]> {
    setLoadingMessage('Fetching Bootcamp Tracks...');
    const response = await fetch(`${apiParameters.endpointUrl}/api/Tracks`, {
        headers: {'Authorization': `Bearer ${apiParameters.token}` }
    });
    if (!response.ok){
        const errorData = await response.json();
        setLoadingMessage(`Failed to load Tracks!. ${errorData.message || 'Unknown error'}`)
        throw new Error("Failed to get Tracks!")
    }
    const results = await response.json() as TrackResponse[]
    return results;
}