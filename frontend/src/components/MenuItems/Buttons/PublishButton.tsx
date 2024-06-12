import './PublishButton.css'

type Props = {
    text: string,
    onClick: () => void
}

export const PublishButton = ( { text, onClick }: Props ) => {
    return(
        <button onClick={onClick} className='btn--orange'>
            {text}
        </button>
    )
}