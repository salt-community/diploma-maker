import { useCache } from "@/hooks";
import {
  BackendTypes,
  BootcampTypes,
  DiplomaService,
  TemplateService,
} from "@/services";
import { ArrowLeftDoubleIcon, ArrowRightDoubleIcon } from "hugeicons-react";
import { useState } from "react";
import { PreviewDiplomaViewer } from "../diploma-viewer";
import { bootcampKey, currentTemplateKey } from "./cacheKeys";
import TemplatePicker from "./TemplatePicker";

interface Props {
  display: boolean;
}

export default function SelectTemplateSubpage({ display }: Props) {
  const [bootcamp, _] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
  const [currentTemplate, __] =
    useCache<BackendTypes.Template>(currentTemplateKey);

  const [studentIndex, setStudentIndex] = useState<number>(0);

  if (display == false) return;

  return (
    <>
      <div>
        <h1 className="mb-6 text-3xl font-bold">Review & Send out</h1>
        <p>
          Choose a template and review the generated diplomas before sending
          them out.
        </p>
      </div>

      <div className="mb-8 mt-20">
        <TemplatePicker />
      </div>

      {currentTemplate && bootcamp != null && (
        <>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost"
              disabled={studentIndex == 0}
              onClick={() => setStudentIndex((prev) => prev - 1)}
            >
              <ArrowLeftDoubleIcon size={40} />
            </button>
            <PreviewDiplomaViewer
              template={TemplateService.backendTemplateToPdfMeTemplate(
                currentTemplate,
              )}
              substitions={DiplomaService.createSubstitions({
                graduationDate: bootcamp.graduationDate,
                studentEmail: bootcamp.students[studentIndex].email,
                studentName: bootcamp.students[studentIndex].name,
                templateGuid: "n/a",
                track: bootcamp.track,
              } as BackendTypes.DiplomaRecord)}
              className="h-[1000px] flex-1 [&>*:first-child]:!bg-base-100"
            />
            <button
              className="btn btn-ghost"
              disabled={studentIndex == bootcamp.students.length - 1}
              onClick={() => setStudentIndex((prev) => prev + 1)}
            >
              <ArrowRightDoubleIcon size={40} />
            </button>
          </div>
          <div className="mt-4 text-center font-display font-medium">
            {studentIndex + 1} of {bootcamp.students.length}
          </div>
        </>
      )}
    </>
  );
}
