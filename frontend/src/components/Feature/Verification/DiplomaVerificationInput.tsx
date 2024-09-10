import { SaveButton } from "../../MenuItems/Buttons/SaveButton";
import { VerifyIcon } from "../../MenuItems/Icons/VerifyIcon";
import logoBlack from '/icons/logoBlack.png'

type Props = {
    inputContent: string;
    setInputContent: (value: React.SetStateAction<string>) => void;
    submitHandler: () => void;
}

export const DiplomaVerificationInput = ({ inputContent, setInputContent, submitHandler }: Props) => {
  return (
    <div className='verificationinput-container'>
        <div className='verificationinput__title-wrapper'>
            <div className='verificationinput__logo-wrapper'>
                <img src={logoBlack} alt="" />
            </div>
            <p>Please put in your diploma verification code.</p>
            <input 
                type="text" 
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)} 
            />
            <SaveButton 
                classNameOverride='verificationinput__title-wrapper--savebtn' 
                textfield='Verify'
                customIcon={<VerifyIcon />} 
                onClick={() => submitHandler()} 
                saveButtonType={'normal'}
            />
        </div>
        <div className='verificationinput__footer-wrapper'>
            <p>This page verifies the authenticity of salt diplomas.</p>
        </div>
    </div>
  );
};