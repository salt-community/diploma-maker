import './PublishButton.css'

type Props = {
    text: string;
    onClick: () => void;
    classNameOverride?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

export const PublishButton = ( { text, onClick, classNameOverride, onMouseEnter, onMouseLeave, type }: Props ) => {
    return(
        <button type={type} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} className={'btn--orange ' + classNameOverride}>
            {text}
        </button>
    )
}