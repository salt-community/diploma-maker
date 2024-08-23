import { useEffect, useState, useRef } from "react";
import {  SaltData } from "../../../util/types"
import { getPlugins, newGenerateCombinedPDF } from "../../../util/helper";
import { Form, Viewer } from "@pdfme/ui";
import { mapTemplateInputsToTemplateViewer, templateInputsFromBootcampData, templateInputsFromSaltData } from "../../../util/dataHelpers";
import './PreviewDiploma.css'

import { PaginationMenu } from "../../MenuItems/PaginationMenu";
import { getFontsData } from "../../../util/fontsUtil";

type Props = {
  saltData: SaltData | null;
  setSelectedStudentIndex: (index: number) => void;
  currentPageIndex: number;
  setCurrentPageIndex: (idx: any) => void;
};

export default function PreviewDiploma({ setSelectedStudentIndex, saltData, currentPageIndex, setCurrentPageIndex }: Props) {

  const uiRef = useRef<HTMLDivElement | null>(null);
  const uiInstance = useRef<Form | Viewer | null>(null);
  

  // When Page Changes -> Loads into PDF preview
  useEffect(() => {
    const inputs = templateInputsFromSaltData(saltData, currentPageIndex)
    const template = mapTemplateInputsToTemplateViewer(saltData, inputs[0]);

    getFontsData().then((font) => {
      if (uiRef.current) {
        if (uiInstance.current) {
          uiInstance.current.destroy();
        }
        uiInstance.current = new ( Viewer )({
          domContainer: uiRef.current,
          template,
          inputs,
          options: { font },
          plugins: getPlugins(),
        });
      }
    });
    setSelectedStudentIndex(currentPageIndex)
    return () => {
      if (uiInstance.current) {
        uiInstance.current.destroy();
        uiInstance.current = null;
      }
    };
  }, [currentPageIndex, saltData]);

  const prevTemplateInstanceHandler = () => {
    if (saltData) {
      setCurrentPageIndex((prevIndex) =>
        prevIndex === 0 ? saltData.students.length - 1 : prevIndex - 1
      );
    }
  };

  const nextTemplateInstanceHandler = () => {

    setCurrentPageIndex((prevIndex) =>
      prevIndex === saltData.students.length - 1 ? 0 : prevIndex + 1
    );

  };

  return (
    <>
      <div
        className="pdfpreview-container"
        ref={uiRef }
        style={{ width: "100%", height: "calc(82vh - 68px)" }}
      />
      <div className="pdfpreview__pagination-menu-wrapper pdfpreview-container" style={{ width: "100%", height: "calc(82vh - 68px)" }}>
        <PaginationMenu
          containerClassOverride="pdfpreview__pagination-menu"
          currentPage={currentPageIndex + 1}
          totalPages={saltData.students.length}
          handleNextPage={nextTemplateInstanceHandler}
          handlePrevPage={prevTemplateInstanceHandler}
        />
      </div>
    </>
  );
}
