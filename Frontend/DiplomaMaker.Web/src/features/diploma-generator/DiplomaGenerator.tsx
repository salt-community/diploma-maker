import { PageContainer } from "@/components/layout";
import { useState } from "react";
import BottomNav from "./BottomNav";
import BootcampDataSubpage from "./bootcamp-data-subpage/BootcampDataSubpage";
import ReviewDiplomasSubpage from "./ReviewDiplomasSubpage";
import { TopNav } from "./TopNav";
import { BootcampData, Subpage } from "./types";
import { DEFAULT_BOOTCAMP_DATA } from "./constants";

export default function DiplomaGenerator() {
  const [currentPage, setCurrentPage] = useState<Subpage>("bootcamp-data");

  const [bootcampData, setBootcampData] = useState<BootcampData>(
    DEFAULT_BOOTCAMP_DATA,
  );

  const handleSetBootcampData = (bootcampData: BootcampData) => {
    setBootcampData(bootcampData);
    setCurrentPage("review-diplomas");
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
          {currentPage == "review-diplomas" && <ReviewDiplomasSubpage />}
        </PageContainer>
      </div>
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}
