import createClient from "openapi-fetch";
import { paths } from "../openApiSchema";

export const client = createClient<paths>({ baseUrl: "http://localhost:5258" });