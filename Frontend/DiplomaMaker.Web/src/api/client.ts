/* 
    Client

    Creates a OpenApi TypeScript client for use when interacting
    with the backend API.
*/

import createClient from "openapi-fetch";
import { paths } from "./openApiSchema";
import { throwOnError } from "./middleware";

export const client = createClient<paths>({ baseUrl: "http://localhost:5171" });
client.use(throwOnError);