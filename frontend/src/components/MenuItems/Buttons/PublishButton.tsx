import { PrintIcon } from '../Icons/PrintIcon';
import { ZipIcon } from '../Icons/ZipIcon';
import './PublishButton.css'

type Props = {
    text: string;
    onClick: () => void;
    classNameOverride?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    type?: 'button' | 'submit' | 'reset';
    specialCreateDiplomasBtn?: boolean
}

export const PublishButton = ( { text, onClick, classNameOverride, onMouseEnter, onMouseLeave, type, specialCreateDiplomasBtn = false }: Props ) => {
    return(
        <button 
            type={type} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave} 
            onClick={onClick} 
            className={'btn--orange ' + classNameOverride}
            style={{padding: `${specialCreateDiplomasBtn ? '.6rem 1.6rem .6rem 1.2rem' : '.6rem 1.2rem'}`}}
        >
            {text}
            {specialCreateDiplomasBtn &&
            <>
                <ZipIcon />
                <PrintIcon />
            </>
            }
        </button>
    )
}