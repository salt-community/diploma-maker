import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "../../api";

const verificationCode = "5d7f8";

export default function GetStudentByVerificationCode() {
  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: [verificationCode],
    queryFn: async () =>
      Endpoints.Students.getStudentByVerificationCode(verificationCode),
  });

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading student...</p>;
    } else if (error) {
      return <p>{error.message}</p>;
    } else {
      return (
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
      );
    }
  };

  return (
    <div>
      <h4>GetStudentByVerificationCode</h4>
      {renderContent()}
    </div>
  );
}
