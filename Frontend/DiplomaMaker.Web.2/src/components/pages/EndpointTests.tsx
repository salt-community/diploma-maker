import GetStudent from "../Tests/GetStudent";
import GetStudents from "../Tests/GetStudents";

export function EndpointTests() {
    return (
        <div className="p-2">
            <h3>Endpoint tests!</h3>
            <GetStudents></GetStudents>
            <GetStudent/>
        </div>
    )
}