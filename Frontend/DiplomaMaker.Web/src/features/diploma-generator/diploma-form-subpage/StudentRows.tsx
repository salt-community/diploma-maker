import { Delete04Icon } from "hugeicons-react";
import { DiplomaFormProps } from "./DiplomaFormProps";

export function StudentRows({ form, fieldArray }: DiplomaFormProps) {
    if (form == null || fieldArray == null) return;

    return fieldArray.fields.map((student, index) => (
        <tr key={student.id} >
            <td>
                <input
                    {...(form.register(`students.${index}.name`, { required: true, minLength: 3 }))}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                />
            </td>

            <td>
                <input
                    {...form.register(`students.${index}.email`, { required: true, minLength: 3 })}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                />
            </td>

            <td>
                <button
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    onClick={() => {
                        fieldArray.remove(index);
                    }}
                    disabled={fieldArray.fields.length <= 1}>
                    <Delete04Icon size={16} />
                </button>
            </td>
        </tr>
    ));
}