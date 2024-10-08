import './VerificationPage.css'
import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { HistorySnapshotResponse } from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useRef, useState } from "react";
import { Form, Viewer } from "@pdfme/ui";
import { mapTemplateInputsToTemplateViewerFromSnapshot } from "../../util/dataHelpers";
import { generatePDFDownload } from '../../util/pdfGenerationUtil';
import { DiplomaRenderer } from '../../components/Feature/Verification/DiplomaRenderer';
import { DiplomaInvalidModule } from '../../components/Feature/Verification/DiplomaInvalidModule';
import { DiplomaValidModule } from '../../components/Feature/Verification/DiplomaValidModule';
import { DiplomaDropDown } from '../../components/Feature/Verification/DiplomaDropDown';

type Props = {
    getHistoryByVerificationCode: (verificationCode: string) => void;
}

export function VertificationPage( { getHistoryByVerificationCode }: Props) {
    const { verificationCode } = useParams<{ verificationCode: string }>();
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

    const { isLoading, data: student, isError } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getHistoryByVerificationCode(verificationCode || ''),
        onSuccess: (data: HistorySnapshotResponse[]) => {
            const activeData = data.find(h => h.active === true); // Selects the first active template that was generated.
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
                            studentData={studentData}
                            displayName={displayName}
                            uiInstance={uiInstance}
                            setDisplayName={setDisplayName}
                        />
                    }
                />
            </main>
        }
        </>
    )
}

