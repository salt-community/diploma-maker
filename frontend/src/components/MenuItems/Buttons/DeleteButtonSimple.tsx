import './DeleteButtonSimple.css'

type Props = {
    type?: ButtonType;
    classNameOverride?: string;
    text?: string;
    onClick: () => void
}

type ButtonType = 'button' | 'submit' | 'reset';

export const DeleteButtonSimple = ({ type = "button", classNameOverride, text = "Delete", onClick } : Props) => {
    return(
        <button
            type={type}
            onClick={onClick}
            className={`delete-btn--simple ${classNameOverride}`}
        >
            {text}
        </button>
    )
}