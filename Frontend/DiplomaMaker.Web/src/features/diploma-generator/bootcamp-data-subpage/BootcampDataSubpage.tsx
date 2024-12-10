import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { BootcampDataSchema } from "../schemas";
import { BootcampData } from "../types";
import FormSection from "./FormSection";
import UploadSection from "./UploadSection";

type Props = {
  bootcampData: BootcampData;
  onSetBootcampData: (bootcampData: BootcampData) => void;
};

export default function BootcampDataSubpage({
  bootcampData,
  onSetBootcampData,
}: Props) {
  const formMethods = useForm<BootcampData>({
    defaultValues: bootcampData,
    resolver: zodResolver(BootcampDataSchema),
  });

  const submitHandler: SubmitHandler<BootcampData> = (data) =>
    onSetBootcampData(data);

  return (
    <>
      <p className="text-center">
        Please provide the information below for generating the diplomas.
      </p>

      <div className="mt-12">
        <UploadSection onUpdateBootcampData={formMethods.reset} />
      </div>

      <div className="mt-20">
        <FormProvider {...formMethods}>
          <FormSection onSubmit={formMethods.handleSubmit(submitHandler)} />
        </FormProvider>
      </div>
    </>
  );
}
