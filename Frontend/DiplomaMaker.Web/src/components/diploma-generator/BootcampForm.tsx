import useCache from "@/hooks/useCache";
import { Bootcamp } from "@/services/fileService";
import { Add01Icon, Delete04Icon } from "hugeicons-react";
import { useFieldArray, useForm } from "react-hook-form";

interface Props {
    bootcamp: Bootcamp;
}

type Student = {
    name: string,
    email: string
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

    const formValues = bootcamp
        ?? {
            track: "Track",
            graduationDate: new Date(Date.now()),
            students: []
        } as Bootcamp;

    const { register, control, handleSubmit } = useForm<Bootcamp>({
        values: formValues
    });

    const { fields, append, remove } = useFieldArray<Bootcamp>({
        control,
        name: 'students',
    });

    const onSubmit = (data: Bootcamp) => console.log(data);

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
                <h2>Students</h2>

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
                    onClick={() => append({ name: 'Student Name', email: "student.name@appliedtechnology.se" })}
                >
                    <Add01Icon size={16} />
                    Add Student
                </button>
            </form>
        </div >
    );
    // <form onSubmit={handleSubmit(onSubmit)}>
    //     <input
    //         className="input input-bordered w-full max-w-xs"
    //         type="text" {...register('track')} />

    //     {fields.map((field, index) => (
    //         <div key={field.id}>
    //             <input
    //                 {...register(`students.${index}.name`)}
    //                 className="input input-bordered w-full max-w-xs"
    //                 defaultValue={field.name}
    //             />
    //             <input
    //                 {...register(`students.${index}.email`)}
    //                 className="input input-bordered w-full max-w-xs"
    //                 defaultValue={field.email}
    //             />
    //             <button type="button" onClick={() => remove(index)}>
    //                 Remove
    //             </button>
    //         </div>
    //     ))}

    //     <button className="btn" type="button" onClick={() => append({ name: 'Student Name', email: "student.name@appliedtechnology.se" })}>
    //         Add Item
    //     </button>

    //     <button className="btn" type="submit">Submit</button>
    // </form>
    // );
    // const [bootcamp, setBootcamp] = useCache<Bootcamp>(["Bootcamp"]);

    // const {
    //     register, handleSubmit, formState: { errors },
    // } = useForm<Inputs>({
    //     defaultValues: {
    //         "students": bootcamp.students.map(student => ({

    //         }))
    //     }
    // });

    // const { fields, append, remove } = useFieldArray<Student>({
    //     name: "students",

    // });

    // const header = (
    //     <tr>
    //         <th>Name</th>
    //         <th>Email</th>
    //     </tr>
    // );

    // const rows = bootcamp && bootcamp.students.map(student => (
    //     <tr key={student.email}>
    //         <td>
    //             <input
    //                 type="text"
    //                 placeholder={student.name}
    //                 className="input input-bordered w-full max-w-xs"
    //                 onChange={(event) => {
    //                     console.log(event.target.value);
    //                 }} />
    //         </td>
    //         <td>
    //             <input type="text" placeholder={student.email} className="input input-bordered w-full max-w-xs" />
    //         </td>
    //     </tr>
    // ));

    // return (

    //     <div className="overflow-x-auto">
    //         <input
    //             type="text"
    //             placeholder={bootcamp && bootcamp.track}
    //             className="input input-bordered w-full max-w-xs"
    //             onChange={(event) => {
    //                 console.log(event.target.value);
    //             }} />

    //         <table className="table">

    //             <thead>
    //                 {header}
    //             </thead>

    //             <tbody>
    //                 {rows}
    //             </tbody>

    //         </table>

    //         <button
    //             className="btn bg-warning hocus:bg-error"
    //             onClick={() => {
    //                 setBootcamp({
    //                     ...bootcamp,
    //                     students: [...bootcamp.students, {
    //                         name: "John Doe",
    //                         email: "john.doe@appliedtechonology.se"
    //                     }]
    //                 })
    //             }}>
    //             Add Student
    //         </button>
    //     </div >
    // );
}