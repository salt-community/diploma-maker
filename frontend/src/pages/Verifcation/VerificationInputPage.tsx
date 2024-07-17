import { SaveButton } from '../../components/MenuItems/Buttons/SaveButton';
import { VerifyIcon } from '../../components/MenuItems/Icons/VerifyIcon';
import './VerificationInputPage.css'

export function VerificationInputPage() {
        return (
            <>
                <div className='verificationinfo-container'>
                    <div className='verificationinfo__logo-wrapper'>
                        <img src="https://talent.salt.dev/logoBlack.png" alt="" />
                    </div>
                    <div className='verificationinfo__title-wrapper'>
                        <p>Please put in your diploma verification code.</p>
                        <input type="text" />¨
                        <SaveButton classNameOverride='verificationinfo__title-wrapper--savebtn' textfield='Verify' customIcon={<VerifyIcon />} onClick={() => {}} saveButtonType={'normal'}/>
                    </div>
                </div>
            </>
        );
    }