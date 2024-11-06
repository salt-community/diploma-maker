import { Endpoints } from '../../api'

export default function GetStudents() {
    return (
        <>
            <button onClick={async () => {
                const students = await Endpoints.Students.getStudents();
                console.log(students);
            }
            }>GetStudents</button>
        </>
    );
}