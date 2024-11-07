import { useMutation } from "@tanstack/react-query";
import { Endpoints } from "../../api";
import { StudentUpdateRequest } from "../../api/dtos/students";

const guid = "bb39fe03-522b-4dde-8b94-c22d1e0111b0";

const newStudent = {
  name: "John Doe",
  email: "test@test.com",
} as StudentUpdateRequest;

export default function UpdateStudent() {
  const {
    data: student,
    isError,
    error,
    isPending,
    isSuccess,
    mutate,
  } = useMutation({
    mutationFn: () => Endpoints.Students.updateStudent(guid, newStudent),
  });

  const renderContent = () => {
    if (isPending) {
      return <p>Updating student...</p>;
    } else if (isError) {
      return <p>{error.message}</p>;
    } else if (isSuccess) {
      return (
        <>
          <p>Updated student: </p>
          <table>
            <thead>
              <tr>
                <td>ID</td>
                <td>Name</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{student?.guid}</td>
                <td>{student?.name}</td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }
  };

  return (
    <div>
      <h4>UpdateStudent</h4>
      {renderContent()}
      <button onClick={() => mutate()}>Update student</button>
    </div>
  );
}
