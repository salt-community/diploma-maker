import './VerificationPage.css'
import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { HistorySnapshotResponse } from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useEffect, useRef, useState } from "react";
import { Form, Viewer } from "@pdfme/ui";
import { mapTemplateInputsToTemplateViewerFromSnapshot } from "../../util/dataHelpers";
import { PublishButton } from '../../components/MenuItems/Buttons/PublishButton';
import { NextIcon } from '../../components/MenuItems/Icons/NextIcon';
import { generatePDFDownload } from '../../util/pdfGenerationUtil';
import { DiplomaRenderer } from '../../components/Feature/Verification/DiplomaRenderer';
import { DiplomaInvalidModule } from '../../components/Feature/Verification/DiplomaInvalidModule';
import { DiplomaValidModule } from '../../components/Feature/Verification/DiplomaValidModule';
import { DiplomaDropDown } from '../../components/Feature/Verification/DiplomaDropDown';
import { getDisplayNameFromBootcampName } from '../../util/fieldReplacersUtil';

type Props = {
    getHistoryByVerificationCode: (verificationCode: string) => void;
}

export function VertificationPage( { getHistoryByVerificationCode }: Props) {
    const { verificationCode } = useParams<{ verificationCode: string }>();

    const uiRef = useRef<HTMLDivElement | null>(null);
    const uiInstance = useRef<Form | Viewer | null>(null);

    const [studentData, setStudentData] = useState<HistorySnapshotResponse>(null);
    const [showDiploma, setShowDiploma] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState('');

    const generatePDFHandler = async () => {
    if (uiInstance.current && studentData) {
        const inputs = uiInstance.current.getInputs();
        const template = mapTemplateInputsToTemplateViewerFromSnapshot(studentData, inputs[0])
        
        await generatePDFDownload(template, inputs, `${studentData.studentName} Diploma`);
    }
    };

    useEffect(() => {
        if(studentData){
            setDisplayName(getDisplayNameFromBootcampName(studentData.bootcampName));
        }
    }, [studentData])

    const { isLoading, data: student, isError } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getHistoryByVerificationCode(verificationCode || ''),
        onSuccess: (data: HistorySnapshotResponse[]) => {
            // Selects the first active template that was generated.
            const activeData = data.find(h => h.active === true);
            setStudentData(activeData);
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
            <DiplomaInvalidModule verificationCode={verificationCode}/>
        );
    }

    return (
        <>
        {studentData &&
            <main>
                <DiplomaValidModule 
                    studentData={studentData}
                    displayName={displayName}
                    setShowDiploma={setShowDiploma}
                />
                <DiplomaDropDown 
                    showDiploma={showDiploma}
                    generatePDFHandler={generatePDFHandler}
                    diplomaRenderer={
                        <DiplomaRenderer 
                            uiRef={uiRef}
                            uiInstance={uiInstance}
                            studentData={studentData}
                            displayName={displayName}
                            setDisplayName={setDisplayName}
                        />
                    }
                />
            </main>
        }
        </>
    )
}

