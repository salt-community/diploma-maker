import './AddButton.css'

type Props = {
  onClick: () => void;
};

export const AddButton = ({ onClick }: Props) => (
  <button className={"add-btn "} onClick={onClick}>
      <>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
          <path d="M3 10V18C3 19.1046 3.89543 20 5 20H11M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10M3 10H21M21 10V13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17 14V17M17 20V17M17 17H14M17 17H20" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="6" cy="7" r="1" fill="#ffffff"></circle> <circle cx="9" cy="7" r="1" fill="#ffffff"></circle> </g>
        </svg>
        <label className='add-btn_title' htmlFor="">New Template</label>
      </>
  </button>
);