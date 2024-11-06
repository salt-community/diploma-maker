import { useMutation } from "@tanstack/react-query";
import { Endpoints } from "../../api";

const guid = "bb39fe03-522b-4dde-8b94-c22d1e0111b0";

export default function DeleteStudent() {
  const mutation = useMutation({
    mutationFn: () => Endpoints.Students.deleteStudent(guid),
  });

  return (
    <div>
      <h4>DeleteStudent</h4>
      <button onClick={() => mutation.mutate()}>Delete student {guid}</button>
    </div>
  );
}
