import createClient from "openapi-fetch";
import type { paths, components } from "../openApiSchema";
import { StudentResponse, StudentUpdateRequest } from "../dtos/students";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getStudents() {
  const { data } = await client.GET("/api/Students/GetStudents");

  return data as unknown as StudentResponse[];
}

export async function getStudentByGuid(guid: string) {
  const { data, error } = await client.GET("/api/Students/GetStudent/{guid}", {
    params: {
      path: {
        guid: guid,
      },
    },
  });

  if (error) throw error;

  return data as unknown as StudentResponse;
}

export async function getStudentByVerificationCode(verificationCode: string) {
  const { data, error } = await client.GET(
    "/api/Students/GetStudentByVericationCode/{verificationCode}",
    {
      params: {
        path: {
          verificationCode,
        },
      },
    }
  );

  if (error) throw error;

  return data as unknown as StudentResponse;
}

export async function updateStudent(
  guid: string,
  request: StudentUpdateRequest
) {
  const { data, error } = await client.PUT(
    "/api/Students/UpdateStudent/{guid}",
    {
      params: {
        path: {
          guid: guid,
        },
      },
      body: request as unknown as components["schemas"]["StudentUpdateRequestDto"],
    }
  );

  if (error) throw error;

  return data as StudentResponse;
}

export async function deleteStudent(guid: string) {
  await client.DELETE("/api/Students/DeleteStudent/{guid}", {
    params: {
      path: {
        guid: guid,
      },
    },
  });
}
