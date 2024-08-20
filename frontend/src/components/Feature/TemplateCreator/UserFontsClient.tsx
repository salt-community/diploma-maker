import { useState } from 'react';
import { SaveButton } from '../../MenuItems/Buttons/SaveButton';
import { CloseWindowIcon } from '../../MenuItems/Icons/CloseWindowIcon';
import { CloudUploadIcon } from '../../MenuItems/Icons/CloudUploadIcon';
import { FontUpload } from '../../MenuItems/Inputs/FontUpload';
import './UserFontsClient.css';
import { UserFontRequestDto } from '../../../util/types';
import { CustomAlertPopupProps, PopupType } from '../../MenuItems/Popups/AlertPopup';

export type UserFontsClientType = 'addNewFont' | 'manageFonts';

type Props = {
    type: UserFontsClientType;
    show: boolean;
    setShowUserFontsClient: (show: boolean) => void;
    customAlert: (alertType: PopupType, title: string, content: string) => void;
}

export const UserFontsClient = ({ type, show, setShowUserFontsClient, customAlert }: Props) => {
    const [fontName, setFontName] = useState<string>("");
    const [fonts, setFonts] = useState<UserFontRequestDto[]>([
        {
            Name: '',
            FontType: 'Regular',
            File: null
        },
        {
            Name: '',
            FontType: 'Bold',
            File: null
        },
        {
            Name: '',
            FontType: 'Italic',
            File: null
        },
    ]);
    
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        if(!fonts[0].File){
            customAlert('message',"Normal Font Required!",`Normal Font Field is required.`);
            return
        }
        setFonts(prevFonts => {
            return prevFonts.map(f => ({...f, Name: fontName}))
        });

        console.log(fonts);
    }

    const setFileAtIndex = (file: File, index: number) => {
        setFonts(prevFonts => {
            const updatedFonts = [...prevFonts];
            updatedFonts[index] = { ...updatedFonts[index], File: file };
            return updatedFonts;
        });
    };

    const removeFileAtIndex = (index: number) => {
        setFonts(prevFonts => {
            const updatedFonts = [...prevFonts];
            updatedFonts[index] = { ...updatedFonts[index], File: null };
            return updatedFonts;
        });
    };

    return (
        <>
            <div className={`userfont ${show && ' visible'}`}>
                <form className="userfont__form" onSubmit={submitHandler}>
                    <div className="userfont__name-wrapper">
                        <h1 className="userfont__title">Font Name - The Soul of a Font</h1>
                        <input
                            required
                            className="userfont__input"
                            type="text"
                            value={fontName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFontName(event.target.value)}
                        />
                    </div>
                    <div className="userfont__file-section">
                        <div className="userfont__file-wrapper">
                            <h3 className="userfont__file-title">Bold</h3>
                            <FontUpload fileResult={(file: File) => setFileAtIndex(file, 1)} removeThisFile={() => removeFileAtIndex(1)} />
                            <p className="userfont__note userfont__note--optional">*Optional</p>
                        </div>
                        <div className="userfont__file-wrapper">
                            <h3 className="userfont__file-title">Normal</h3>
                            <FontUpload fileResult={(file: File) => setFileAtIndex(file, 0)} removeThisFile={() => removeFileAtIndex(0)} />
                            <p className="userfont__note userfont__note--required">*Required</p>
                        </div>
                        <div className="userfont__file-wrapper">
                            <h3 className="userfont__file-title">Italic</h3>
                            <FontUpload fileResult={(file: File) => setFileAtIndex(file, 2)} removeThisFile={() => removeFileAtIndex(2)} />
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
                            type='submit'
                        />
                    </div>
                </form>
                <button onClick={() => setShowUserFontsClient(false)} className='userfont__close-btn'>
                    <CloseWindowIcon />
                </button>
            </div>
            <div className={`userfont-backgroundblur ${show && ' visible'}`}></div>
        </>
    );
};