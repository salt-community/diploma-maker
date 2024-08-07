type Props = {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  className?: string;
};

export const ApplyIcon = ({ onMouseEnter, onMouseLeave, onClick, className }: Props) => {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 32 32"
      version="1.1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <g id="Approved"></g>
        <g id="Approved_1_"></g>
        <g id="File_Approve"></g>
        <g id="Folder_Approved"></g>
        <g id="Security_Approved"></g>
        <g id="Certificate_Approved"></g>
        <g id="User_Approved">
          <g>
            <path d="M25.72,24.638c-0.547,0.072-0.934,0.574-0.861,1.121C24.952,26.48,25,27.234,25,28c0,0.34-0.014,0.677-0.033,1H7.033C7.014,28.677,7,28.34,7,28c0-7.168,4.037-13,9-13c2.044,0,4.054,1.037,5.659,2.919c0.357,0.42,0.989,0.47,1.41,0.112c0.42-0.358,0.47-0.99,0.111-1.41c-1.018-1.193-2.183-2.108-3.429-2.722C21.701,12.655,23,10.479,23,8c0-3.86-3.141-7-7-7S9,4.14,9,8c0,2.486,1.307,4.667,3.265,5.91C8.035,16.001,5,21.52,5,28c0,0.76,0.058,1.484,0.114,2.093C5.162,30.607,5.594,31,6.11,31H25.89c0.517,0,0.948-0.393,0.996-0.907C26.942,29.484,27,28.76,27,28c0-0.852-0.054-1.693-0.159-2.5C26.77,24.953,26.269,24.561,25.72,24.638z M11,8c0-2.757,2.243-5,5-5s5,2.243,5,5s-2.243,5-5,5S11,10.757,11,8z"></path>
            <path d="M30.73,15.317c-0.379-0.403-1.01-0.423-1.414-0.047l-10.004,9.36l-4.629-4.332c-0.404-0.377-1.036-0.357-1.414,0.047c-0.377,0.403-0.356,1.036,0.047,1.413l5.313,4.971c0.192,0.18,0.438,0.27,0.684,0.27s0.491-0.09,0.684-0.27l10.688-10C31.087,16.353,31.107,15.72,30.73,15.317z"></path>
          </g>
        </g>
        <g id="ID_Card_Approved"></g>
        <g id="Android_Approved"></g>
        <g id="Privacy_Approved"></g>
        <g id="Approved_2_"></g>
        <g id="Message_Approved"></g>
        <g id="Upload_Approved"></g>
        <g id="Download_Approved"></g>
        <g id="Email_Approved"></g>
        <g id="Data_Approved"></g>
      </g>
    </svg>
  );
};
