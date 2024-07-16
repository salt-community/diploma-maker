import './VerificationPage.css'
import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import QRCode from "react-qr-code";
import { BootcampResponse, Student, StudentResponse, TemplateResponse } from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useEffect, useRef, useState } from "react";
import { Form, Viewer } from "@pdfme/ui";
import { generatePDF, getFontsData, getPlugins, populateField } from "../../util/helper";
import { makeTemplateInput } from "../../templates/baseTemplate";
import { mapTemplateInputsToTemplateViewer, mapTemplateInputsToTemplateViewerSingle, templateInputsSingleBootcampandTemplate } from "../../util/dataHelpers";
import { PublishButton } from '../../components/MenuItems/Buttons/PublishButton';

type Props = {
    getStudentByVerificationCode: (verificationCode: string) => void
    bootcamps: BootcampResponse[] | null;
    templates: TemplateResponse[] | null;
}

export function VertificationPage( { getStudentByVerificationCode, bootcamps, templates }: Props) {
    const { verificationCode } = useParams<{ verificationCode: string }>();

    const uiRef = useRef<HTMLDivElement | null>(null);
    const uiInstance = useRef<Form | Viewer | null>(null);

    const [studentData, setStudentData] = useState<StudentResponse>(null);
    const [bootcampData, setBootcampData] = useState<BootcampResponse>(null);
    const [templateData, setTemplateData] = useState<TemplateResponse>(null);

    useEffect(() => {
        if(studentData && bootcamps && templates && !bootcampData){
            const selectedBootcamp = bootcamps.find(bootcamp => 
                bootcamp.students.some(student => student.guidId === studentData.guidId)
            );
            setBootcampData(selectedBootcamp);

            const selectedTemplate = templates.find(template => 
                template.id === selectedBootcamp.templateId
            );
            setTemplateData(selectedTemplate);
        }
    }, [bootcamps, templates, studentData])

    useEffect(() => {
        if(templateData && bootcampData && studentData){
            const inputs = templateInputsSingleBootcampandTemplate(bootcampData, templateData, student.name, student.verificationCode);
            const template = mapTemplateInputsToTemplateViewerSingle(templateData, inputs[0])

            getFontsData().then((font) => {
                if(uiInstance.current){
                    uiInstance.current.destroy();
                }
                uiInstance.current = new Viewer({
                    domContainer: uiRef.current,
                    template,
                    inputs,
                    options: { font },
                    plugins: getPlugins()
                });
            })

            return () => {
                if(uiInstance.current){
                    uiInstance.current.destroy();
                    uiInstance.current = null;
                }
            }
            
        }
    }, [uiRef, templateData])

    const generatePDFHandler = async () => {
        if (uiInstance.current && templateData && bootcampData) {
          const inputs = uiInstance.current.getInputs();
          const pdfInput = makeTemplateInput(
              inputs[0].header,
              inputs[0].main,
              inputs[0].footer,
              inputs[0].pdfbase,
              inputs[0].link
          )
          const template = mapTemplateInputsToTemplateViewerSingle(templateData, inputs[0])
         
          await generatePDF(template, inputs);
        }
      };

    const { isLoading, data: student, isError } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getStudentByVerificationCode(verificationCode || ''),
        onSuccess: (data: StudentResponse) => {
            setStudentData(data);
        },
        retry: false
    });

    if (isLoading) {
        return (
            <div className='spinner-container'>
                <SpinnerDefault classOverride="spinner"/>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-center mt-4">
                <h1 className="text-3xl font-bold text-gray-900">The diploma with Verification code: {verificationCode} is not authentic.</h1>
            </div>
        );
    }

    return (
        <>
        {bootcampData && templateData && studentData &&
            <>
                <h1 className="mb-4 text-5xl text-center font-extrabold leading-none tracking-tight text-gray-900 ">Congratulations!</h1>
                <h2 className="mb-4 text-3xl text-center font-bold leading-none tracking-tight text-gray-900 ">This is to certify that {student!.name} with id {student!.verificationCode} successfully completed the training on {bootcampData.graduationDate.toString().slice(0, 10)} from the {bootcampData.name}.</h2>
                <h2 className="mb-4 text-3xl text-center font-bold leading-none tracking-tight text-gray-900 ">This diploma is valid and authentic.</h2>
                <PublishButton text="Download Diploma" onClick={generatePDFHandler} />
                <div
                    className="pdfpreview-container"
                    ref={uiRef}
                    style={{ width: "100%", height: "calc(82vh - 68px)" }}
                />
            </>
        }
        </>
    )
}

