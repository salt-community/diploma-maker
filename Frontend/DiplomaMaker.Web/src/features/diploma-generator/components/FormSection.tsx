import { UserAdd01Icon, UserRemove01Icon } from "hugeicons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BOOTCAMP_DATA_FORM_ID } from "../constants";
import { BootcampData } from "../types";

type Props = {
  onSubmit: () => void;
};

export default function FormSection({ onSubmit }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BootcampData>();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "students",
  });

  return (
    <form id={BOOTCAMP_DATA_FORM_ID} onSubmit={onSubmit}>
      {/* BOOTCAMP SECTION */}
      <div>
        <div className="divider divider-start mb-0 font-display font-medium text-secondary">
          Bootcamp
        </div>

        <div className="mt-6 flex gap-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Track</span>
            </div>
            <input
              {...register("track")}
              className={`input input-bordered w-full ${errors.track && "input-error"}`}
              type="text"
              placeholder="E.g. JSFS"
            />
            {errors.track && (
              <div className="label">
                <span className="label-text text-error">
                  {errors.track?.message}
                </span>
              </div>
            )}
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Graduation Date</span>
            </div>
            <input
              {...register("graduationDate")}
              className={`input input-bordered w-full ${errors.graduationDate && "input-error"}`}
              type="date"
            />
            {errors.graduationDate && (
              <div className="label">
                <span className="label-text text-error">
                  {errors.graduationDate?.message}
                </span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* STUDENTS SECTION */}
      <div className="mt-20">
        <div className="divider divider-start mb-0 font-display font-medium text-secondary">
          Students
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-stretch gap-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Name</span>
                </div>
                <input
                  {...register(`students.${index}.name` as const)}
                  placeholder="First Last"
                  className={`input input-bordered w-full ${errors.students && errors.students[index]?.name && "input-error"}`}
                />
                {errors.students && errors.students[index]?.name && (
                  <div className="label">
                    <span className="label-text text-error">
                      {errors.students[index].name.message}
                    </span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input
                  {...register(`students.${index}.email` as const)}
                  placeholder="first.last@appliedtechnology.se"
                  className={`input input-bordered w-full ${errors.students && errors.students[index]?.email && "input-error"}`}
                />
                {errors.students && errors.students[index]?.email && (
                  <div className="label">
                    <span className="label-text text-error">
                      {errors.students[index].email.message}
                    </span>
                  </div>
                )}
              </label>

              <div>
                <div className="label opacity-0">
                  <span className="label-text">.</span>
                </div>
                <button
                  className="btn btn-error"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  <UserRemove01Icon size={24} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline btn-secondary mt-4 w-full"
            onClick={() => append({ name: "", email: "" })}
          >
            <UserAdd01Icon size={24} />
            Add Student
          </button>
        </div>
      </div>
    </form>
  );
}
