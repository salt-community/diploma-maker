import { useState } from 'react';
import './VerificationInputPage.css'
import { AlertPopup } from '../../components/MenuItems/Popups/AlertPopup';
import { useCustomAlert } from '../../components/Hooks/useCustomAlert';
import { useNavigate } from 'react-router-dom';
import { DiplomaVerificationInput } from '../../components/Feature/Verification/DiplomaVerificationInput';

export function VerificationInputPage() {
    const [inputContent, setInputContent] = useState<string>('');
    const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
    const navigate = useNavigate();

    const submitHandler = () => {
        if(inputContent.trim() !== ''){
            navigate(`/verify/${inputContent}`);
        }
        else{
            customAlert('fail',"Validation Error",`Please make sure the field is not empty`);
        }
    }

    return (
        <>
            <AlertPopup
                title={popupContent[0]}
                text={popupContent[1]}
                popupType={popupType}
                show={showPopup}
                onClose={closeAlert}
            />
            <DiplomaVerificationInput 
                inputContent={inputContent}
                setInputContent={setInputContent}
                submitHandler={submitHandler}
            />
        </>
    );
    }