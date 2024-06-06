import { useState } from "react";
import AddDeplomaForm from "../components/AddDiplomaForm";
import PDFGenerator from "../components/PDFGenerator";
import { Template, checkTemplate } from "@pdfme/common";
import { getTemplate } from "../templates/baseTemplate";

type Mode = "form" | "viewer";

const initTemplate = () => {
  let template: Template = getTemplate();
  try {
    const templateString = localStorage.getItem("template");
    const templateJson = templateString
      ? JSON.parse(templateString)
      : getTemplate();
    checkTemplate(templateJson);
    template = templateJson as Template;
  } catch {
    localStorage.removeItem("template");
  }
  return template;
};

export default function DiplimaMaking(){
    const [studentNames, setStudentNames] = useState<string[]>([]);

    function UpdateStudentNames(names: string[]){
        setStudentNames(names);
    }

    return (
        <>
        <PDFGenerator names={studentNames}/>
        <AddDeplomaForm updateStudentNames = {UpdateStudentNames}/>

        </>
    )
}