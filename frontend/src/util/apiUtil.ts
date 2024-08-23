import { initApiEndpoints } from "../services/apiFactory";

export const getToken = (): string => {
    const jwtToken = document.cookie
        .split('; ')
        .find(c => c.includes('__session'))
        ?.split('=')[1] || '';
    return jwtToken
  }
  
export let api = initApiEndpoints({
    endpointUrl: import.meta.env.VITE_API_URL,
    token: getToken()
});