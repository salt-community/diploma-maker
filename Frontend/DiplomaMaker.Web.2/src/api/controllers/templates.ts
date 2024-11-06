import createClient from "openapi-fetch";
import type { components, paths } from "../openApiSchema";
import {
  TemplatePostRequest,
  TemplateRequest,
  TemplateResponse,
} from "../dtos/templates";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getTemplates() {
  const { data } = await client.GET("/api/Templates/GetTemplates");

  return data as unknown as TemplateResponse[];
}

export async function getTemplateById(id: number) {
  const { data, error } = await client.GET("/api/Templates/GetTemplate/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  if (error) throw error;

  return data as TemplateResponse;
}

export async function postTemplate(request: TemplatePostRequest) {
  const { data, error } = await client.POST("/api/Templates/PostTemplate", {
    body: request,
  });

  if (error) throw error;

  return data as unknown as TemplateResponse;
}

export async function putTemplate(id: number, request: TemplateRequest) {
  const { data, error } = await client.PUT("/api/Templates/PutTemplate/{id}", {
    params: {
      path: {
        id,
      },
    },
    body: request as unknown as components["schemas"]["TemplateRequestDto"],
  });

  if (error) throw error;

  return data as TemplateResponse;
}

export async function deleteTemple(id: number) {
  const { error } = await client.DELETE("/api/Templates/DeleteTemplate/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  if (error) throw error;
}
