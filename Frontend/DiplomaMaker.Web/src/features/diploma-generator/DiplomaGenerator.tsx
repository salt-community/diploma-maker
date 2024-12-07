import { PageContainer } from "@/components/layout";
import { useState } from "react";
import BottomNav from "./BottomNav";
import DiplomaDataSubpage from "./DiplomaDataSubpage";
import ReviewDiplomasSubpage from "./ReviewDiplomasSubpage";
import { TopNav } from "./TopNav";
import { Subpage } from "./types";

export default function DiplomaGenerator() {
  const [currentPage, setCurrentPage] = useState<Subpage>("diploma-data");

  return (
    <div className="flex h-full flex-col">
      <TopNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 overflow-y-scroll">
        <PageContainer className="!pt-12">
          {currentPage == "diploma-data" && <DiplomaDataSubpage />}
          {currentPage == "review-diplomas" && <ReviewDiplomasSubpage />}
        </PageContainer>
      </div>
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}
