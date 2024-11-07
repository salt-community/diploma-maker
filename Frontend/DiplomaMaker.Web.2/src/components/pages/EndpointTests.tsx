import TemplatesTest from "../Tests/TemplatesTest";

export function EndpointTests() {
  return (
    <div className="p-2">
      <h3>Endpoint tests!</h3>
      <div className="bg-slate-500">
        <h2>Templates</h2>
        <TemplatesTest />
        <hr />
        {/* <h2>Students</h2>
        <hr />
        <GetStudents />
        <GetStudent />
        <GetStudentByVerificationCode />
        <UpdateStudent />
        <DeleteStudent /> */}
      </div>
    </div>
  );
}