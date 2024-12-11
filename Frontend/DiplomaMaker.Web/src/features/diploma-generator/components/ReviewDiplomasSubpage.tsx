import { BackendTypes } from "@/services";
import { useEffect } from "react";
import useTemplates from "../hooks/useTemplates";
import { BootcampData } from "../types";
import DiplomaGallery from "./DiplomaGallery";
import TemplatePicker from "./TemplatePicker";

type Props = {
  bootcampData: BootcampData;
  selectedTemplate: BackendTypes.Template | undefined;
  setSelectedTemplate: (template: BackendTypes.Template) => void;
};

export default function ReviewDiplomasSubpage({
  bootcampData,
  selectedTemplate,
  setSelectedTemplate,
}: Props) {
  const { data: templates } = useTemplates();

  useEffect(() => {
    if (!templates) return;

    if (!selectedTemplate && templates.length) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates]);

  return (
    <>
      <p className="text-center">
        Choose a template and review the generated diplomas before sending them
        out.
      </p>

      <div className="mt-12">
        <TemplatePicker
          templates={templates ?? []}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
      </div>

      {selectedTemplate && (
        <div className="mt-4">
          <DiplomaGallery
            bootcampData={bootcampData}
            template={selectedTemplate}
          />
        </div>
      )}
    </>
  );
}
