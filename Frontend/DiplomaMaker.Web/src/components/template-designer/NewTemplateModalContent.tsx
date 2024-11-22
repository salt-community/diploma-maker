import clsx from "clsx";
import { SubmitHandler, useForm } from "react-hook-form";

export type Props = {
  onNewTemplate: (name: string) => void;
  onCancel: () => void;
};

export type Inputs = {
  templateName: string;
};

export default function NewTemplateModalContent({
  onNewTemplate,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) =>
    onNewTemplate(data.templateName);

  const templateNameClass = clsx("input input-bordered w-full", {
    "input-error": errors.templateName,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Template Name</span>
        </div>
        <input
          className={templateNameClass}
          type="text"
          placeholder="Enter a template name..."
          {...register("templateName", {
            required: "Template name is required.",
            minLength: {
              value: 3,
              message: "Template name must be at least 3 characters long.",
            },
          })}
        />
        <div className="label">
          {errors.templateName && (
            <span className="label-text font-medium text-error">
              {errors.templateName.message}
            </span>
          )}
        </div>
      </label>
      <div className="mt-4 flex gap-2">
        <button className="btn btn-primary" type="submit">
          Create
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
