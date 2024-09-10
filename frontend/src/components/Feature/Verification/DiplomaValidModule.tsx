import { HistorySnapshotResponse } from "../../../util/types";
import { NextIcon } from "../../MenuItems/Icons/NextIcon";
import { ValidDocumentIcon } from "../../MenuItems/Icons/ValidDocumentIcon";
import logoBlack from '/icons/logoBlack.png'

type Props = {
    studentData: HistorySnapshotResponse;
    displayName: string;
    setShowDiploma: (show: boolean) => void;
}

export const DiplomaValidModule = ({ studentData, displayName, setShowDiploma }: Props) => {
  return (
    <div className='verificationinfo-container'>
        <div className='verificationinfo__logo-wrapper'>
            <img src={logoBlack} alt="" />
        </div>
        <div className='verificationinfo__title-wrapper'>
            <h1>{studentData.studentName}</h1>
            <p>Has successfully graduated from School Of Applied Technology</p>
            <h2>{displayName}</h2>
        </div>
        <div className='verificationinfo__footer-wrapper'>
            <p>Graduation Date: <span>{studentData.bootcampGraduationDate.toString().slice(0, 10)}</span></p>
            <p>Verification Code: <span>{studentData.verificationCode}</span></p>
            <div className='verificationinfo__footer-wrapper--icon-container'>
                <ValidDocumentIcon />
                <p>This diploma is authentic</p>
            </div>
        </div>
        <div onClick={() => setShowDiploma(true)} className='verificationinfo__more-btn'>
            <NextIcon rotation={-90}/>
        </div>
    </div>
  );
};