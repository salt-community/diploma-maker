import './VerificationPage.css'
import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import QRCode from "react-qr-code";
import { BootcampResponse, Student, StudentResponse, TemplateResponse } from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useEffect, useRef, useState } from "react";
import { Form, Viewer } from "@pdfme/ui";
import { getFontsData, getPlugins, populateField } from "../../util/helper";
import { makeTemplateInput } from "../../templates/baseTemplate";
import { mapTemplateInputsToTemplateViewer, mapTemplateInputsToTemplateViewerSingle } from "../../util/dataHelpers";

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
            const inputs = [makeTemplateInput(
                populateField(
                  // @ts-ignore
                  templateData.intro,
                  bootcampData.name,
                  bootcampData.graduationDate.toString().slice(0, 10),
                  student.name
                ),
                populateField(
                  // @ts-ignore
                  templateData.main,
                  bootcampData.name,
                  bootcampData.graduationDate.toString().slice(0, 10),
                  student.name
                ),
                populateField(
                  // @ts-ignore
                  templateData.footer,
                  bootcampData.name,
                  bootcampData.graduationDate.toString().slice(0, 10),
                  student.name
                ),
                // @ts-ignore
                templateData.basePdf,
                student.verificationCode
              )];
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
    }, [uiRef, studentData, templateData, bootcampData])

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

