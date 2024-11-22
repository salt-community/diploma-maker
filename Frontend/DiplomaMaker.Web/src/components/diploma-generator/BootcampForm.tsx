import { Add01Icon, Delete04Icon } from "hugeicons-react";
import { useFieldArray, useForm } from "react-hook-form";

import { useCache } from "@/hooks";
import { StringService } from "@/services";
import type { FileTypes } from "@/services";

//TODO: Make sure that at least one student is assigned before submitting

type BootcampStringDate = Omit<FileTypes.Bootcamp, "graduationDate"> & {
    graduationDate: string
}

interface Props {
    onSubmit: () => void
}

const defaultStudent = {
    name: 'Student Name',
    email: "student.name@appliedtechnology.se"
}

const defaultFormBootcamp: BootcampStringDate = {
    graduationDate: StringService.formatDate_YYYY_mm_dd(new Date(Date.now())),
    track: "Coding Quest",
    students: [defaultStudent]
}

export default function BootcampForm({ onSubmit }: Props) {
    const [bootcamp, setBootcamp] = useCache<FileTypes.Bootcamp>(["Bootcamp"]);

    const formBootcamp: BootcampStringDate = !bootcamp
        ? defaultFormBootcamp
        : {
            graduationDate: StringService.formatDate_YYYY_mm_dd(bootcamp.graduationDate),
            track: bootcamp.track,
            students: bootcamp.students
        }

    const { register, control, handleSubmit } = useForm<BootcampStringDate>({
        values: formBootcamp
    });

    const { fields, append, remove } = useFieldArray<BootcampStringDate>({
        control,
        name: 'students',
    });

    const onFormSubmit = (bootcamp: BootcampStringDate) => {
        const updatedBootcamp: FileTypes.Bootcamp = {
            track: bootcamp.track,
            graduationDate: new Date(bootcamp.graduationDate),
            students: bootcamp.students
        };
        setBootcamp(updatedBootcamp);
        onSubmit();
    };

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
                    {...register(`students.${index}.name`, { required: true, minLength: 3 })}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                />
            </td>
            <td>
                <input
                    {...register(`students.${index}.email`, { required: true, minLength: 3 })}
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
        <div className="overflow-x-auto p-4 max-w-screen-lg">
            <form onSubmit={handleSubmit(onFormSubmit)}>
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

                <button
                    type="submit"
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                >
                    <Add01Icon size={16} />
                    Submit
                </button>
            </form>
        </div >
    );
}