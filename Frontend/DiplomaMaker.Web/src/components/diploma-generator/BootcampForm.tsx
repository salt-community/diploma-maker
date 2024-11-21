import useCache from "@/hooks/useCache";
import { Bootcamp } from "@/services/fileService";
import { useFieldArray, useForm } from "react-hook-form";

export type Inputs = {
    templateName: string;
};

type Student = {
    name: string,
    email: string
}

export default function BootcampForm(bootcamp) {
    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            items: bootcamp ? bootcamp.students : [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });
    const onSubmit = (data) => console.log(data);
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
                <div key={field.id}>
                    <input
                        {...register(`items.${index}.name`)}
                        className="input input-bordered w-full max-w-xs"
                        defaultValue={field.name}
                    />
                    <input
                        {...register(`items.${index}.email`)}
                        className="input input-bordered w-full max-w-xs"
                        defaultValue={field.email}
                    />
                    <button type="button" onClick={() => remove(index)}>
                        Remove
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => append({ name: '', email: 0 })}>
                Add Item
            </button>
            <button type="submit">Submit</button>
        </form>
    );
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