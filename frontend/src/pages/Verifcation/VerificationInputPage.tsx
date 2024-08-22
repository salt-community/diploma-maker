import { useState } from 'react';
import { SaveButton } from '../../components/MenuItems/Buttons/SaveButton';
import { VerifyIcon } from '../../components/MenuItems/Icons/VerifyIcon';
import './VerificationInputPage.css'
import { AlertPopup } from '../../components/MenuItems/Popups/AlertPopup';
import { useCustomAlert } from '../../components/Hooks/useCustomAlert';
import { useNavigate } from 'react-router-dom';

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
            <div className='verificationinput-container'>
                <div className='verificationinput__title-wrapper'>
                    <div className='verificationinput__logo-wrapper'>
                        <img src="/icons/logoBlack.png" alt="" />
                    </div>
                    <p>Please put in your diploma verification code.</p>
                    <input type="text" onChange={(e) => setInputContent(e.target.value)} value={inputContent}/>
                    <SaveButton classNameOverride='verificationinput__title-wrapper--savebtn' textfield='Verify' customIcon={<VerifyIcon />} onClick={() => submitHandler()} saveButtonType={'normal'}/>
                </div>
                <div className='verificationinput__footer-wrapper'>
                    <p>This page verifies the authenticity of salt diplomas.</p>
                </div>
            </div>
        </>
    );
    }