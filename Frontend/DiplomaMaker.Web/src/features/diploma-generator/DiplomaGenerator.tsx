import { PageContainer } from "@/components/layout";
import { useToken } from "@/hooks";
import { DiplomaService, TemplateService } from "@/services";
import { BackendTypes } from "@/services/backendService";
import { useState } from "react";
import BootcampDataSubpage from "./components/BootcampDataSubpage";
import BottomNav from "./components/BottomNav";
import ReviewDiplomasSubpage from "./components/ReviewDiplomasSubpage";
import { TopNav } from "./components/TopNav";
import { DEFAULT_BOOTCAMP_DATA } from "./constants";
import useCreateDiplomaMutation from "./hooks/useCreateDiplomaMutation";
import { BootcampData, Subpage } from "./types";

export default function DiplomaGenerator() {
  const { token } = useToken();

  const { mutate: createDiploma } = useCreateDiplomaMutation();

  const [currentPage, setCurrentPage] = useState<Subpage>("bootcamp-data");

  const [bootcampData, setBootcampData] = useState<BootcampData>(
    DEFAULT_BOOTCAMP_DATA,
  );

  const [selectedTemplate, setSelectedTemplate] =
    useState<BackendTypes.Template>();

  const handleSetBootcampData = (bootcampData: BootcampData) => {
    setBootcampData(bootcampData);
    setCurrentPage("review-diplomas");
  };

  const handleSendDiplomas = () => {
    if (!selectedTemplate || !token) return;

    for (const student of bootcampData.students) {
      const diploma = {
        studentName: student.name,
        studentEmail: student.email,
        track: bootcampData.track,
        graduationDate: new Date(bootcampData.graduationDate),
        templateGuid: selectedTemplate.guid!,
      };

      createDiploma(diploma, {
        onSuccess: async (newDiploma) => {
          await DiplomaService.emailDiploma(
            TemplateService.backendTemplateToPdfMeTemplate(selectedTemplate!),
            newDiploma,
            token!,
          );
        },
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="flex-1 overflow-y-scroll">
        <PageContainer className="!pt-12">
          {currentPage == "bootcamp-data" && (
            <BootcampDataSubpage
              bootcampData={bootcampData}
              onSetBootcampData={handleSetBootcampData}
            />
          )}

          {currentPage == "review-diplomas" && (
            <ReviewDiplomasSubpage
              bootcampData={bootcampData}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />
          )}
        </PageContainer>
      </div>

      <BottomNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onSendDiplomas={handleSendDiplomas}
      />
    </div>
  );
}
