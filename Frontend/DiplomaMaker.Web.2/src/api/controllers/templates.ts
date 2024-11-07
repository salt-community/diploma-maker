import type { components } from "../openApiSchema";
import {
  TemplatePostRequest,
  TemplateRequest,
  TemplateResponse,
} from "../dtos/templates";
import { client } from "./client";


export async function getTemplates() {
  const { data } = await client.GET("/api/Templates/GetTemplates");

  return data as unknown as TemplateResponse[];
}

export async function getTemplateById(id?: number) {
  if (!id) throw new Error("Undefined template id");

  const { data, error } = await client.GET("/api/Templates/GetTemplate/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  if (!error && data) return data as TemplateResponse;

  throw new Error(`${error.status}: ${error.detail}`);
}

export async function postTemplate(request: TemplatePostRequest) {
  const { data, error } = await client.POST("/api/Templates/PostTemplate", {
    body: request,
  });

  if (!error && data) return data as unknown as TemplateResponse;

  throw new Error(`${error.status}: ${error.detail}`);
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

  if (!error && data) return data as TemplateResponse;
}

export async function deleteTemplate(id: number) {
  const { error } = await client.DELETE("/api/Templates/DeleteTemplate/{id}", {
    params: {
      path: {
        id,
      },
    },
  });

  if (!error) return;

  throw new Error(`${error.status}: ${error.detail}`);
}
