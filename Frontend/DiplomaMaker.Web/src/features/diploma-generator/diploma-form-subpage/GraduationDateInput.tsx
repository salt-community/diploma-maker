import { DiplomaFormProps } from "./DiplomaFormProps";

export function GraduationDateInput({ form }: DiplomaFormProps) {
  if (form == null) return;

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">Graduation Date</span>
      </div>

      <input
        {...form.register("graduationDate")}
        className="input input-bordered w-full"
        type="date"
      />
    </label>
  );
}
