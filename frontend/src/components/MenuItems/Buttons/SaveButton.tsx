import { CloudUploadIcon } from '../Icons/CloudUploadIcon';
import { DeleteTemplateIcon } from '../Icons/DeleteTemplateIcon';
import { GtaSaveIcon } from '../Icons/GtaSaveIcon';
import './SaveButton.css';

type Props = {
  classNameOverride?: string;
  onClick: () => void;
  saveButtonType: SaveButtonType;
  textfield: string;
  customIcon?: React.ReactNode;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export type SaveButtonType = 'grandTheftAuto' | 'normal' | 'remove' | 'warning';

export const SaveButton = ({ classNameOverride, onClick, saveButtonType, textfield, customIcon, disabled, onMouseEnter, onMouseLeave }: Props) => (
  <button 
    className={"save-btn " + classNameOverride + (saveButtonType === 'grandTheftAuto' ? ' gta' : saveButtonType === 'remove' ? ' remove' : ' normal')} 
    onClick={() => {!disabled && onClick()}}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {customIcon ? (
      <>
        {customIcon}
        {saveButtonType !== 'grandTheftAuto' && (
          <label className='save-btn_title' htmlFor="">{textfield}</label>
        )}
      </>
    ) : saveButtonType === 'grandTheftAuto' ? (
      <GtaSaveIcon />
    ) : saveButtonType === 'normal' ? (
      <>
        <CloudUploadIcon />
        <label className='save-btn_title' htmlFor="">{textfield}</label>
      </>
    ) : (
      <>
        <DeleteTemplateIcon />
        <label className='save-btn_title' htmlFor="">{textfield}</label>
      </>
    )}
  </button>
);