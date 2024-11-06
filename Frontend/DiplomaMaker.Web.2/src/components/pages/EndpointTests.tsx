import DeleteStudent from "../Tests/DeleteStudent";
import GetStudent from "../Tests/GetStudent";
import GetStudentByVerificationCode from "../Tests/GetStudentByVerificationCode";
import GetStudents from "../Tests/GetStudents";
import UpdateStudent from "../Tests/UpdateStudent";

export function EndpointTests() {
  return (
    <div className="p-2">
      <h3>Endpoint tests!</h3>
      <div className="bg-slate-500">
        <h2>Students</h2>
        <hr />
        <GetStudents />
        <GetStudent />
        <GetStudentByVerificationCode />
        <UpdateStudent />
        <DeleteStudent />
      </div>
    </div>
  );
}
