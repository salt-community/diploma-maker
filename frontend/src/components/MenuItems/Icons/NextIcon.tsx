type Props = {
  rotation?: number
}

export const NextIcon = ({ rotation }: Props) => {
    return (
      <svg viewBox="0 0 24 24" style={{ transform: (rotation ? `rotate(${rotation}deg)` : `rotate(0deg)`) }} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 7L10 12L15 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
}