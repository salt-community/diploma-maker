import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "../../api";

const guid = "c519f3b3-f378-483c-802e-68c090a717cc";

export default function GetStudent() {
  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: [guid],
    queryFn: async () => Endpoints.Students.getStudent(guid),
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
      <h4>GetStudent</h4>
      {renderContent()}
    </div>
  );
}
