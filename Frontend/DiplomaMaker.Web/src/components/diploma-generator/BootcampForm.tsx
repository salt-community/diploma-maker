import useCache from "@/hooks/useCache";
import { Bootcamp } from "@/services/fileService";
import { Add01Icon, Delete04Icon } from "hugeicons-react";
import { useFieldArray, useForm } from "react-hook-form";

type BootcampStringDate = Omit<Bootcamp, "graduationDate"> & {
    graduationDate: string
}

interface Props {
    bootcamp: Bootcamp;
}

const defaultStudent = {
    name: 'Student Name',
    email: "student.name@appliedtechnology.se"
}

const defaultFormBootcamp: BootcampStringDate = {
    graduationDate: formatDate(new Date(Date.now())),
    track: "Coding Quest",
    students: []
}

function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
}

export default function BootcampForm({ }: Props) {
    const [bootcamp, setBootcamp] = useCache<Bootcamp>(["Bootcamp"]);

    if (!bootcamp) {
        setBootcamp({
            graduationDate: new Date(Date.now()),
            track: "CSharp",
            students: []
        });
    }

    const formBootcamp: BootcampStringDate = !bootcamp
        ? defaultFormBootcamp
        : {
            graduationDate: formatDate(bootcamp.graduationDate),
            track: bootcamp.track,
            students: bootcamp.students
        }

    console.log(formBootcamp);

    const { register, control, handleSubmit } = useForm<BootcampStringDate>({
        values: formBootcamp
    });

    const { fields, append, remove } = useFieldArray<BootcampStringDate>({
        control,
        name: 'students',
    });

    const onSubmit = (data: BootcampStringDate) => console.log(data);

    const header = (
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th></th>
        </tr>
    );

    const rows = bootcamp && fields.map((student, index) => (
        <tr key={student.id}>
            <td>
                <input
                    {...register(`students.${index}.name`)}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                />
            </td>
            <td>
                <input
                    {...register(`students.${index}.email`)}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                />
            </td>
            <td>
                <button
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    onClick={() => remove(index)}
                >
                    <Delete04Icon size={16} />
                    Remove
                </button>
            </td>
        </tr>
    ));

    return (
        <div className="overflow-x-auto p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Track</span>
                    </div>
                    <input {...register('track')}
                        className="input input-bordered w-full max-w-xs"
                        type="text"
                    />
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Graduation Date</span>
                    </div>
                    <input {...register('graduationDate')}
                        className="input input-bordered w-full max-w-xs"
                        type="date"
                    />
                </label>

                <span className="label-text">Students</span>

                <table className="table">

                    <thead>
                        {header}
                    </thead>

                    <tbody>
                        {rows}
                    </tbody>

                </table>

                <button
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    onClick={() => append(defaultStudent)}
                >
                    <Add01Icon size={16} />
                    Add Student
                </button>
            </form>
        </div >
    );
}