import { useState } from "react";
import AddDeplomaForm from "../components/AddDiplomaForm";
import PDFGenerator from "../components/PDFGenerator";

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