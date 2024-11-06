import createClient from "openapi-fetch";
import type { components, paths } from "../openApiSchema";
import { UserFontRequest, UserFontResponse } from "../dtos/userFonts";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getUserFonts() {
  const { data } = await client.GET("/api/UserFonts/GetUserFonts");

  return data as unknown as UserFontResponse[];
}

export async function postUserFonts(request: UserFontRequest[]) {
  const { data } = await client.POST("/api/UserFonts/PostUserFonts", {
    body: {
      userFonts:
        request as unknown as components["schemas"]["UserFontRequestDto"][],
    },
  });

  return data as unknown as UserFontResponse[];
}
