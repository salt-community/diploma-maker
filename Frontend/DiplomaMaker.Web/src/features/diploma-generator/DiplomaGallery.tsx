import { BackendTypes, DiplomaService, TemplateService } from "@/services";
import { ArrowLeftDoubleIcon, ArrowRightDoubleIcon } from "hugeicons-react";
import { useState } from "react";
import { PreviewDiplomaViewer } from "../diploma-viewer";
import { BootcampData } from "./types";

type Props = {
  bootcampData: BootcampData;
  template: BackendTypes.Template;
};

export default function DiplomaGallery({ bootcampData, template }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <div className="mx-auto max-w-screen-md">
      <div className="flex items-center gap-2">
        <button
          className="btn btn-ghost disabled:bg-transparent"
          disabled={currentIndex == 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
        >
          <ArrowLeftDoubleIcon size={40} />
        </button>

        <PreviewDiplomaViewer
          template={TemplateService.backendTemplateToPdfMeTemplate(template)}
          substitions={DiplomaService.createSubstitions({
            graduationDate: new Date(bootcampData.graduationDate),
            studentEmail: bootcampData.students[currentIndex].email,
            studentName: bootcampData.students[currentIndex].name,
            templateGuid: "n/a",
            track: bootcampData.track,
          } as BackendTypes.DiplomaRecord)}
          className="aspect-[1/1.414] flex-1 [&>*:first-child]:!bg-base-100"
        />

        <button
          className="btn btn-ghost disabled:bg-transparent"
          disabled={currentIndex == bootcampData.students.length - 1}
          onClick={() => setCurrentIndex((prev) => prev + 1)}
        >
          <ArrowRightDoubleIcon size={40} />
        </button>
      </div>
      <div className="mt-2 text-center font-display font-medium">
        {currentIndex + 1} of {bootcampData.students.length}
      </div>
    </div>
  );
}
