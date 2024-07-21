type Props = {
    rotation?: number;
}

export const ArrowIcon = ( { rotation = 0 }: Props ) => {
    return(
        <svg style={{transition: `rotate(${rotation}deg)`}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
            <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
        </svg>
    )
}