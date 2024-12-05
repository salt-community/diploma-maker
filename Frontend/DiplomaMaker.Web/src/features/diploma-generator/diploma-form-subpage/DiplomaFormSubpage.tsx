import { useCache, useToken } from "@/hooks";
import {
  BackendTypes,
  BootcampService,
  BootcampTypes,
  DiplomaService,
  TemplateService,
} from "@/services";
import { useFieldArray, useForm } from "react-hook-form";
import { bootcampKey, currentTemplateKey } from "../cacheKeys";
import UploadBootcamp from "../UploadBootcamp";
import { AddStudentRow } from "./AddStudentRow";
import { GraduationDateInput } from "./GraduationDateInput";
import { StudentRows } from "./StudentRows";
import { TrackInput } from "./TrackInput";

interface Props {
  display: boolean;
}

export function DiplomaFormSubpage({ display }: Props) {
  const [bootcamp, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
  const [currentTemplate, __] =
    useCache<BackendTypes.Template>(currentTemplateKey);
  const { token } = useToken();

  if (bootcamp == null) setBootcamp(BootcampService.defaultBootcamp);

  const formBootcamp = bootcamp
    ? BootcampService.bootcampToFormBootcamp(bootcamp)
    : BootcampService.defaultFormBootcamp;

  const form = useForm<BootcampTypes.FormBootcamp>({ values: formBootcamp });

  const fieldArray = useFieldArray<BootcampTypes.FormBootcamp>({
    control: form.control,
    name: "students",
  });

  const onFormSubmit = form.handleSubmit(
    (bootcamp: BootcampTypes.FormBootcamp) => {
      const updatedBootcamp = BootcampService.formBootcampToBootcamp(bootcamp);
      setBootcamp(updatedBootcamp);

      if (!currentTemplate) throw new Error("No template");

      if (!token || token == null) throw new Error("No token");

      updatedBootcamp.students.forEach(async (student) => {
        const diploma = await DiplomaService.postDiploma(
          currentTemplate,
          updatedBootcamp,
          student,
        );

        if (import.meta.env.VITE_SEND_DIPLOMAS == 1) {
          await DiplomaService.emailDiploma(
            TemplateService.backendTemplateToPdfMeTemplate(currentTemplate),
            diploma,
            token,
          );
        }
      });
    },
  );

  if (!form || !fieldArray) return;

  return (
    <form
      id={import.meta.env.VITE_DIPLOMA_FORM_ID}
      onSubmit={onFormSubmit}
      hidden={!display}
    >
      <p className="text-center">
        Please provide the information below for generating the diplomas.
      </p>

      <div className="mt-12 text-center">
        <h2 className="mb-6 text-lg font-medium">
          Upload a bootcamp.json file to auto-fill the form
          <span className="mt-3 block text-base font-normal opacity-80">
            (optional)
          </span>
        </h2>
        <UploadBootcamp />
      </div>

      <div className="mt-20">
        <div className="divider divider-start mb-0 font-display font-medium text-secondary">
          Bootcamp
        </div>
        <div className="mt-6 flex gap-4">
          <TrackInput form={form} fieldArray={fieldArray} />
          <GraduationDateInput form={form} fieldArray={fieldArray} />
        </div>
      </div>

      <div className="mt-20">
        <div className="divider divider-start mb-0 font-display font-medium text-secondary">
          Students
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <StudentRows form={form} fieldArray={fieldArray} />
          <AddStudentRow form={form} fieldArray={fieldArray} />
        </div>
      </div>
    </form>
  );
}
