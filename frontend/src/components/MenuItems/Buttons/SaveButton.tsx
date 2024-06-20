import './SaveButton.css'

type Props = {
  onClick: () => void;
  saveButtonType: SaveButtonType
};

export enum SaveButtonType {
  grandTheftAuto,
  normal,
  remove
}

export const SaveButton = ({ onClick, saveButtonType }: Props) => (
  <button className={"save-btn " + (saveButtonType === SaveButtonType.grandTheftAuto ? 'gta' : saveButtonType === SaveButtonType.remove ? 'remove' : 'normal')} onClick={onClick}>
    {saveButtonType === SaveButtonType.normal ? 
      <>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
          <path d="M12 19V12M12 12L9.75 14.3333M12 12L14.25 14.3333M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path> </g>
        </svg>
        <label className='save-btn_title' htmlFor="">Save Template</label>
      </>
    : saveButtonType === SaveButtonType.grandTheftAuto ?
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path fillRule="evenodd" clipRule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#000"></path>
      </g>
    </svg>
    :
    <>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
          <path d="M3 10V18C3 19.1046 3.89543 20 5 20H12M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10M3 10H21M21 10V12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.8787 14.8787C15.3358 15.4216 15 16.1716 15 17C15 18.6569 16.3431 20 18 20C18.8284 20 19.5784 19.6642 20.1213 19.1213M15.8787 14.8787C16.4216 14.3358 17.1716 14 18 14C19.6569 14 21 15.3431 21 17C21 17.8284 20.6642 18.5784 20.1213 19.1213M15.8787 14.8787L18 17L20.1213 19.1213" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path> </g>
        </svg>
        <label className='save-btn_title' htmlFor="">Remove Template</label>
    </>
    }
    
  </button>
);