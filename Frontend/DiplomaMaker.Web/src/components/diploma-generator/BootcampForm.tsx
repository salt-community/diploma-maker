import useCache from "@/hooks/useCache";
import { Bootcamp } from "@/services/fileService";

export default function BootcampForm() {
    const [bootcamp, setBootcamp] = useCache<Bootcamp>(["Bootcamp"]);

    const header = (
        <tr>
            <th>Name</th>
            <th>Email</th>
        </tr>
    );

    const rows = bootcamp && bootcamp.students.map(student => (
        <tr key={student.email}>
            <td>
                <input
                    type="text"
                    placeholder={student.name}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(event) => {
                        console.log(event.target.value);
                    }} />
            </td>
            <td>
                <input type="text" placeholder={student.email} className="input input-bordered w-full max-w-xs" />
            </td>
        </tr>
    ));

    return (
        <div className="overflow-x-auto">
            <table className="table">

                <thead>
                    {header}
                </thead>

                <tbody>
                    {rows}
                </tbody>

            </table>

            <button
                className="btn bg-warning hocus:bg-error"
                onClick={() => {
                    setBootcamp({
                        ...bootcamp,
                        students: [...bootcamp.students, {
                            name: "John Doe",
                            email: "john.doe@appliedtechonology.se"
                        }]
                    })
                }}>
                Add Student
            </button>
        </div >
    );
}