import { Add01Icon, Delete04Icon } from "hugeicons-react";
import { useFieldArray, useForm } from "react-hook-form";

import { BootcampService } from "@/services";
import type { BackendTypes, BootcampTypes } from "@/services";
import { useCache } from "@/hooks";
import { bootcampKey, selectedTemplateKey } from "./cacheKeys";

interface Props {
    onSubmit: () => void
}

export default function BootcampForm({ onSubmit }: Props) {
    const [bootcamp, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
    const [selectedTemplate, _] = useCache<BackendTypes.NamedEntity>(selectedTemplateKey);

    if (bootcamp == null)
        setBootcamp(BootcampService.defaultBootcamp);

    const formBootcamp = bootcamp
        ? BootcampService.bootcampToFormBootcamp(bootcamp)
        : BootcampService.defaultFormBootcamp;

    if (!formBootcamp)
        throw new Error("formBootcamp could not be initialized");

    const { register, control, handleSubmit } = useForm<BootcampTypes.FormBootcamp>({
        values: formBootcamp
    });

    const { fields: studentFields, append, remove } = useFieldArray<BootcampTypes.FormBootcamp>({
        control,
        name: 'students',
    });

    const onFormSubmit = (bootcamp: BootcampTypes.FormBootcamp) => {
        const updatedBootcamp = BootcampService.formBootcampToBootcamp(bootcamp);
        setBootcamp(updatedBootcamp);
        onSubmit();
    };

    const header = (<tr>
        <th>Name</th><th>Email</th><th></th>
    </tr>);

    const rows = studentFields.map((student, index) => (
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
                    onClick={() => {
                        remove(index);

                    }}
                    disabled={studentFields.length <= 1}>
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

                <table className="table my-4">

                    <thead>
                        {header}
                    </thead>

                    <tbody>
                        {rows}
                    </tbody>

                </table>

                <button
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    onClick={() => append(BootcampService.defaultStudent)}>
                    <Add01Icon size={16} />
                    Add Student
                </button>

                <button
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    disabled={selectedTemplate == null}
                >
                    <Add01Icon size={16} />
                    Preview Diploma
                </button>

                <button
                    type="submit"
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    disabled={selectedTemplate == null}>
                    <Add01Icon size={16} />
                    Send Out Diplomas
                </button>
            </form>
        </div >
    );
}