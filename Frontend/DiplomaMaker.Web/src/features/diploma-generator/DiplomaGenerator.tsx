import { PageContainer } from "@/components/layout";
import {
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  MailAtSign01Icon,
} from "hugeicons-react";
import { useState } from "react";
import { DiplomaForm } from "./diploma-form-subpage";
import SelectTemplateSubpage from "./SelectTemplateSubpage";
import { currentTemplateKey } from "./cacheKeys";
import { useCache } from "@/hooks";
import { BackendTypes } from "@/services";

export default function DiplomaGenerator() {
  const [currentTemplate, __] =
    useCache<BackendTypes.Template>(currentTemplateKey);
  const [pageNumber, setPageNumber] = useState<number>(0);

  function DiplomaGeneratorNavbar() {
    const steps = ["Diploma Data", "Review & Send out"].map((title, index) => (
      <li
        className={`step mt-0 ${index <= pageNumber && "step-primary"}`}
        key={index}
      >
        <button onClick={() => setPageNumber(index)}>{title}</button>
      </li>
    ));

    return <ul className="steps w-full p-0 font-display">{steps}</ul>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <PageContainer>
          <DiplomaGeneratorNavbar />
          <DiplomaForm display={pageNumber == 0} />
          <SelectTemplateSubpage display={pageNumber == 1} />
        </PageContainer>
      </div>
      <div className="sticky bottom-0 z-40 min-h-[80px] w-full bg-neutral">
        <div className="mx-auto flex h-full max-w-screen-lg items-center justify-between gap-4">
          <button
            className="btn btn-secondary min-w-32"
            onClick={() => setPageNumber(0)}
            disabled={pageNumber == 0}
          >
            <ArrowLeftDoubleIcon size={24} />
            Previous
          </button>
          {pageNumber == 1 ? (
            <button
              type="submit"
              form={import.meta.env.VITE_DIPLOMA_FORM_ID}
              className="btn bg-primary text-primary-content hocus:bg-primary-focus"
              disabled={!currentTemplate}
            >
              Send out Diplomas
              <MailAtSign01Icon size={24} />
            </button>
          ) : (
            <button
              className="btn btn-primary min-w-32"
              onClick={() => setPageNumber(1)}
              disabled={pageNumber == 1}
            >
              Next
              <ArrowRightDoubleIcon size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
