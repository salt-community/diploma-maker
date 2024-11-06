import type { components } from "../openApiSchema";
import { UserFontRequest, UserFontResponse } from "../dtos/userFonts";
import { client } from "./client";


export async function getUserFonts() {
  const { data } = await client.GET("/api/UserFonts/GetUserFonts");

  return data as unknown as UserFontResponse[];
}

export async function postUserFonts(request: UserFontRequest[]) {
  const { data } = await client.POST("/api/UserFonts/PostUserFonts", {
    body: {
      ...request as unknown as components["schemas"]["UserFontRequestDto"][]
    }
  });

  return data as unknown as UserFontResponse[];
}
