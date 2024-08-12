import './PublishButton.css'

type Props = {
    text: string;
    onClick: () => void;
    classNameOverride?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const PublishButton = ( { text, onClick, classNameOverride, onMouseEnter, onMouseLeave }: Props ) => {
    return(
        <button onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} className={'btn--orange ' + classNameOverride}>
            {text}
        </button>
    )
}