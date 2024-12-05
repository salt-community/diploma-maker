import { PageContainer } from "@/components/layout";
import { useCache } from "@/hooks";
import { BackendTypes } from "@/services";
import {
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  SentIcon,
} from "hugeicons-react";
import { useState } from "react";
import { currentTemplateKey } from "./cacheKeys";
import { DiplomaForm } from "./diploma-form-subpage";
import SelectTemplateSubpage from "./SelectTemplateSubpage";

export default function DiplomaGenerator() {
  const [currentTemplate, __] =
    useCache<BackendTypes.Template>(currentTemplateKey);
  const [pageNumber, setPageNumber] = useState<number>(0);

  function DiplomaGeneratorSteps() {
    const steps = ["Diploma Data", "Review & Send out"].map((title, index) => (
      <li
        className={`step mt-0 ${index <= pageNumber && "step-primary"}`}
        key={index}
      >
        <button onClick={() => setPageNumber(index)}>{title}</button>
      </li>
    ));

    return (
      <div className="w-full bg-neutral py-2 pr-4 shadow-sm">
        <div className="mx-auto max-w-screen-lg">
          <ul className="steps w-full p-0 font-display">{steps}</ul>
        </div>
      </div>
    );
  }

  function DiplomaGeneratorBottomNav() {
    return (
      <div className="min-h-20 w-full bg-neutral pr-4">
        <div className="mx-auto flex h-full max-w-screen-lg items-center justify-between gap-4 px-6">
          <button
            className="btn btn-secondary min-w-32"
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber == 0}
          >
            <ArrowLeftDoubleIcon size={24} />
            Previous
          </button>
          {pageNumber == 1 ? (
            <button
              type="submit"
              form={import.meta.env.VITE_DIPLOMA_FORM_ID}
              className="btn btn-primary"
              disabled={!currentTemplate}
            >
              Send Diplomas
              <SentIcon size={24} />
            </button>
          ) : (
            <button
              className="btn btn-primary min-w-32"
              onClick={() => setPageNumber((prev) => prev + 1)}
            >
              Next
              <ArrowRightDoubleIcon size={24} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <DiplomaGeneratorSteps />
      <div className="flex-1 overflow-y-scroll">
        <PageContainer>
          <DiplomaForm display={pageNumber == 0} />
          <SelectTemplateSubpage display={pageNumber == 1} />
        </PageContainer>
      </div>
      <DiplomaGeneratorBottomNav />
    </div>
  );
}
