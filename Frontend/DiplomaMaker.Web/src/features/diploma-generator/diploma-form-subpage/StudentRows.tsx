import { UserRemove01Icon } from "hugeicons-react";
import { DiplomaFormProps } from "./DiplomaFormProps";

export function StudentRows({ form, fieldArray }: DiplomaFormProps) {
  if (form == null || fieldArray == null) return;

  return fieldArray.fields.map((student, index) => (
    <div key={student.id} className="flex items-end gap-4">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Name</span>
        </div>
        <input
          {...form.register(`students.${index}.name`, {
            required: true,
            minLength: 3,
          })}
          type="text"
          className="input input-bordered w-full"
        />
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Email</span>
        </div>
        <input
          {...form.register(`students.${index}.email`, {
            required: true,
            minLength: 3,
          })}
          type="text"
          className="input input-bordered w-full"
        />
      </label>

      <button
        className="btn btn-error"
        onClick={() => {
          fieldArray.remove(index);
        }}
        disabled={fieldArray.fields.length <= 1}
      >
        <UserRemove01Icon size={18} />
      </button>
    </div>
  ));
}
