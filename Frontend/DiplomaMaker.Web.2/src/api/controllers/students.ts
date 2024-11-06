import type { components } from "../openApiSchema";
import { StudentResponse, StudentUpdateRequest } from "../dtos/students";
import { client } from "./client";

export async function getStudents() {
  const { data } = await client.GET("/api/Students/GetStudents");

  return data as unknown as StudentResponse[];
}

export async function getStudent(guid: string) {
  const { data, error } = await client.GET("/api/Students/GetStudent/{guid}", {
    params: {
      path: {
        guid: guid,
      },
    },
  });

  if (error) {
    switch (error.status) {
      case 404:
        throw new Error("Student not found.");
      default:
        throw new Error("Error retrieving student.");
    }
  }

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

  if (error) {
    switch (error.status) {
      case 404:
        throw new Error("Student not found.");
      default:
        throw new Error("Error retrieving student.");
    }
  }

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

  if (error) {
    switch (error.status) {
      case 400:
        throw new Error(
          "Could not update student. One or more fields was incorrect."
        );
      default:
        throw new Error("Error updating student.");
    }
  }

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
