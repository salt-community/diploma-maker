import './VerificationPage.css'
import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { BootcampResponse, StudentResponse, TemplateResponse } from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useEffect, useRef, useState } from "react";
import { Form, Viewer } from "@pdfme/ui";
import { generatePDF, getFontsData, getPlugins } from "../../util/helper";
import { makeTemplateInput } from "../../templates/baseTemplate";
import { mapTemplateInputsToTemplateViewerSingle, templateInputsSingleBootcampandTemplate } from "../../util/dataHelpers";
import { PublishButton } from '../../components/MenuItems/Buttons/PublishButton';
import { SuccessIcon } from '../../components/MenuItems/Icons/SuccessIcon';
import { NextIcon } from '../../components/MenuItems/Icons/NextIcon';
import logoBlack from '/icons/logoBlack.png'

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

    const [showDiploma, setShowDiploma] = useState<boolean>(false);

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
        if(bootcamps && templates && templateData && bootcampData && studentData){
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
            <>
                {verificationCode &&
                    <div className='verificationinfo-container invalid'>
                    <div className='verificationinfo__logo-wrapper invalid'>
                        <img src="https://talent.salt.dev/logoBlack.png" alt="" />
                    </div>
                    <div className='verificationinfo__title-wrapper invalid'>
                        <p>The diploma with Verification code: {verificationCode} could <span>not</span> be verified.</p>
                    </div>
                    <div className='verificationinfo__footer-wrapper invalid'>
                        <div className='verificationinfo__footer-wrapper--icon-container invalid'>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <path d="M18.5 20C18.5 20.275 18.276 20.5 18 20.5H12.2678C11.9806 21.051 11.6168 21.5557 11.1904 22H18C19.104 22 20 21.104 20 20V9.828C20 9.298 19.789 8.789 19.414 8.414L13.585 2.586C13.57 2.57105 13.5531 2.55808 13.5363 2.5452C13.5238 2.53567 13.5115 2.5262 13.5 2.516C13.429 2.452 13.359 2.389 13.281 2.336C13.2557 2.31894 13.2281 2.30548 13.2005 2.29207C13.1845 2.28426 13.1685 2.27647 13.153 2.268C13.1363 2.25859 13.1197 2.24897 13.103 2.23933C13.0488 2.20797 12.9944 2.17648 12.937 2.152C12.74 2.07 12.528 2.029 12.313 2.014C12.2933 2.01274 12.2738 2.01008 12.2542 2.00741C12.2271 2.00371 12.1999 2 12.172 2H6C4.896 2 4 2.896 4 4V11.4982C4.47417 11.3004 4.97679 11.1572 5.5 11.0764V4C5.5 3.725 5.724 3.5 6 3.5H12V8C12 9.104 12.896 10 14 10H18.5V20ZM13.5 4.621L17.378 8.5H14C13.724 8.5 13.5 8.275 13.5 8V4.621Z" fill="#212121"></path> <path d="M12 17.5C12 20.5376 9.53757 23 6.5 23C3.46243 23 1 20.5376 1 17.5C1 14.4624 3.46243 12 6.5 12C9.53757 12 12 14.4624 12 17.5ZM6.5 14C6.22386 14 6 14.2239 6 14.5V18.5C6 18.7761 6.22386 19 6.5 19C6.77614 19 7 18.7761 7 18.5V14.5C7 14.2239 6.77614 14 6.5 14ZM6.5 21.125C6.84518 21.125 7.125 20.8452 7.125 20.5C7.125 20.1548 6.84518 19.875 6.5 19.875C6.15482 19.875 5.875 20.1548 5.875 20.5C5.875 20.8452 6.15482 21.125 6.5 21.125Z" fill="#212121"></path> </g>
                            </svg>
                            <p>This diploma is not authentic</p>
                        </div>
                        </div>
                    </div>
                }
            </>
        );
    }

    return (
        <>
        {bootcampData && templateData && studentData &&
            <main>
                <div className='verificationinfo-container'>
                    <div className='verificationinfo__logo-wrapper'>
                        <img src={logoBlack} alt="" />
                    </div>
                    <div className='verificationinfo__title-wrapper'>
                        <h1>{student!.name}</h1>
                        <p>Has successfully graduated from School Of Applied Technology</p>
                        <h2>{bootcampData.name}</h2>
                    </div>
                    <div className='verificationinfo__footer-wrapper'>
                        <p>Graduation Date: <span>{bootcampData.graduationDate.toString().slice(0, 10)}</span></p>
                        <p>Verification Code: <span>{student!.verificationCode}</span></p>
                        <div className='verificationinfo__footer-wrapper--icon-container'>
                            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.709 31.709"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> 
                                <path d="M10.595,25.719H4.696c-1.127,0-2.06-0.886-2.06-2.013V5.42c0-1.127,0.933-2.006,2.06-2.006h14.277 c1.127,0,2.047,0.879,2.047,2.006v15.323l2.637-3.135V3.462c0-1.482-1.172-2.684-2.652-2.684H2.559C1.136,0.778,0,1.932,0,3.354 v22.382c0,1.482,1.185,2.688,2.669,2.688h10.358l-1.224-1.063C11.267,26.896,10.864,26.327,10.595,25.719z"></path> <path d="M17.875,6.794H6.034c-0.728,0-1.314,0.591-1.314,1.318c0,0.726,0.587,1.317,1.314,1.317h11.84 c0.728,0,1.312-0.591,1.312-1.317C19.188,7.386,18.602,6.794,17.875,6.794z"></path> <path d="M17.875,11.187H6.034c-0.728,0-1.314,0.59-1.314,1.318c0,0.724,0.587,1.318,1.314,1.318h11.84 c0.728,0,1.312-0.594,1.312-1.318C19.188,11.777,18.602,11.187,17.875,11.187z"></path> 
                                <path d="M17.875,15.581H6.034c-0.728,0-1.314,0.558-1.314,1.286c0,0.725,0.587,1.282,1.314,1.282h11.84 c0.728,0,1.312-0.56,1.312-1.282C19.188,16.139,18.602,15.581,17.875,15.581z"></path> <path d="M4.719,21.056c0,0.727,0.587,1.283,1.314,1.283h4.418c0.185-0.473,0.469-1.022,0.857-1.479 c0.408-0.473,0.889-0.82,1.412-1.092H6.034C5.306,19.771,4.719,20.331,4.719,21.056z"></path> <path d="M17.875,19.771h-0.988c0.324,0.137,0.633,0.366,0.916,0.611l1.312,1.123c0.05-0.135,0.076-0.28,0.076-0.437 C19.188,20.346,18.602,19.771,17.875,19.771z"></path> 
                                <path d="M30.898,16.249c-0.965-0.828-2.42-0.71-3.246,0.26l-7.564,8.867l-3.781-3.248c-0.968-0.826-2.421-0.717-3.248,0.248 c-0.829,0.967-0.717,2.418,0.248,3.246l5.533,4.752c0.422,0.358,0.951,0.557,1.5,0.557c0.062,0,0.119-0.002,0.182-0.008 c0.607-0.047,1.176-0.336,1.572-0.801l9.066-10.627C31.982,18.528,31.869,17.077,30.898,16.249z"></path> </g> </g> </g>
                            </svg>
                            <p>This diploma is authentic</p>
                        </div>
                    </div>
                    <div onClick={() => setShowDiploma(true)} className='verificationinfo__more-btn'>
                        <NextIcon rotation={-90}/>
                    </div>
                </div>
                <div className={'diploma-container ' + (showDiploma ? 'visible' : '')}>
                    <div className='diploma-container-content'>
                        <PublishButton classNameOverride='diploma-container--downloadbtn' text="Download Diploma" onClick={generatePDFHandler} />
                        <div
                            className="pdfpreview-smallcontainer"
                            ref={uiRef}
                            style={{ width: "100%", height: "100%", marginBottom: '2rem'}}
                        />
                    </div>
                </div>
            </main>
        }
        </>
    )
}

