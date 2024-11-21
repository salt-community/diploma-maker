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
            <td>{student.name}</td>
            <td>{student.email}

                {/* <button
                    className="btn bg-warning hocus:bg-error"
                    onClick={() => deleteTemplate(student.guid!)}>
                    <Delete04Icon size={24} />
                </button> */}
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
        </div>
    );
}