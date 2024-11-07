import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "../../api";

export default function GetStudents() {
  const {
    data: students,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["students"],
    queryFn: Endpoints.Students.getStudents,
  });

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading students...</p>;
    } else if (error) {
      return <p>{error.message}</p>;
    } else {
      return students?.length ? (
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
            </tr>
          </thead>
          <tbody>
            {students?.map((s) => (
              <tr>
                <td>{s.guid}</td>
                <td>{s.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "There are no students."
      );
    }
  };

  return (
    <div>
      <h4>GetStudents</h4>
      {renderContent()}
    </div>
  );
}
