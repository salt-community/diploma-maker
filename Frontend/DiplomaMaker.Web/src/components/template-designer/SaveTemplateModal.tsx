import { SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "../layout";

export type Props = {
  onSaveTemplate: (name: string) => void;
};

export type Inputs = {
  templateName: string;
};

export default function SaveTemplateModal({ onSaveTemplate }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onSaveTemplate(data.templateName);

    (
      document.getElementById(
        import.meta.env.VITE_SAVE_TEMPLATE_MODAL_ID,
      ) as HTMLDialogElement
    ).close();
  };

  return (
    <Modal
      id={import.meta.env.VITE_SAVE_TEMPLATE_MODAL_ID}
      title={"Save Template"}
    >
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Enter template name"
          {...register("templateName", { required: true, minLength: 3 })}
        />
        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={errors.templateName != undefined}
        >
          Save
        </button>
        {errors.templateName && <span>This field is required</span>}
      </form>
    </Modal>
  );
}
