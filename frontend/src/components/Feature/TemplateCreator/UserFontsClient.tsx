import { AddButton } from '../../MenuItems/Buttons/AddButton';
import { PublishButton } from '../../MenuItems/Buttons/PublishButton';
import { SaveButton } from '../../MenuItems/Buttons/SaveButton';
import { CloseIcon } from '../../MenuItems/Icons/CloseIcon';
import { CloseWindowIcon } from '../../MenuItems/Icons/CloseWindowIcon';
import { CloudUploadIcon } from '../../MenuItems/Icons/CloudUploadIcon';
import { FontUpload } from '../../MenuItems/Inputs/FontUpload';
import './UserFontsClient.css'

export type UserFontsClientType = 'addNewFont' | 'manageFonts'

type Props = {
    type: UserFontsClientType;
    show: boolean;
    setShowUserFontsClient: (show: boolean) => void;
}

export const UserFontsClient = ( { type, show, setShowUserFontsClient }: Props) => {
  return (
    <>
        <div className={`userfont ${show && ' visible'}`}>
            <form className="userfont__form">
                <div className="userfont__name-wrapper">
                    <h1 className="userfont__title">Font Name - The Soul of a Font</h1>
                    <input className="userfont__input" type="text" />
                </div>
                <div className="userfont__file-section">
                    <div className="userfont__file-wrapper">
                        <h3 className="userfont__file-title">Bold</h3>
                        <FontUpload fileResult={() => {}} />
                        <p className="userfont__note userfont__note--optional">*Optional</p>
                    </div>
                    <div className="userfont__file-wrapper">
                        <h3 className="userfont__file-title">Normal</h3>
                        <FontUpload fileResult={() => {}} />
                        <p className="userfont__note userfont__note--required">*Required</p>
                    </div>
                    <div className="userfont__file-wrapper">
                        <h3 className="userfont__file-title">Italic</h3>
                        <FontUpload fileResult={() => {}} /> 
                        {/* className="userfont__upload" */}
                        <p className="userfont__note userfont__note--optional">*Optional</p>
                    </div>
                </div>
                <div className="userfont__submit-wrapper">
                    <SaveButton 
                        classNameOverride="userfont__submit-button" 
                        saveButtonType={'normal'} 
                        textfield={'Submit Your New Font!'}
                        onClick={() => {}}
                        customIcon={<CloudUploadIcon />} 
                    />
                </div>
            </form>
            <button onClick={() => {setShowUserFontsClient(false)}} className='userfont__close-btn'>
                <CloseWindowIcon />
            </button>
        </div>
        <div className={`userfont-backgroundblur ${show && ' visible'}`}></div>
    </>
  );
};