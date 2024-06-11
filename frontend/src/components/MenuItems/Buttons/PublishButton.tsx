import './PublishButton.css'

type Props = {
    text: string
}

export const PublishButton = ( { text }: Props ) => {
    return(
        <button className='btn--orange'>
            {text}
        </button>
    )
}