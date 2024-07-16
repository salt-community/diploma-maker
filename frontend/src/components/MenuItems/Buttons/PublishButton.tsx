import './PublishButton.css'

type Props = {
    text: string,
    onClick: () => void,
    classNameOverride?: string
}

export const PublishButton = ( { text, onClick, classNameOverride }: Props ) => {
    return(
        <button onClick={onClick} className={'btn--orange ' + classNameOverride}>
            {text}
        </button>
    )
}