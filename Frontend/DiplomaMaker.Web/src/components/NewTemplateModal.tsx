import { NamedEntity } from "@/services/backendService/models";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "./layout/Modal";

type NewTemplateModalProps = {
  onCreateNewTemplate: (template: NamedEntity) => void;
};

type Inputs = {
  templateName: string;
};

export default function NewTemplateModal({
  onCreateNewTemplate,
}: NewTemplateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onCreateNewTemplate({ name: data.templateName });
    console.log(data.templateName);
    (
      document.getElementById(
        import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID,
      ) as HTMLDialogElement
    ).close();
  };
  return (
    <Modal id={import.meta.env.VITE_NEW_TEMPLATE_MODAL_ID}>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Template Name"
          {...register("templateName", { required: true, minLength: 3 })}
        />
        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={errors.templateName != undefined}
        >
          Create
        </button>
        {errors.templateName && <span>This field is required</span>}
      </form>
    </Modal>
  );
}
