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
};

export enum SaveButtonType {
  grandTheftAuto,
  normal,
  remove
}

export const SaveButton = ({ classNameOverride, onClick, saveButtonType, textfield, customIcon }: Props) => (
  <button className={"save-btn " + classNameOverride + (saveButtonType === SaveButtonType.grandTheftAuto ? ' gta' : saveButtonType === SaveButtonType.remove ? ' remove' : ' normal')} onClick={onClick}>
    {customIcon ? (
      <>
        {customIcon}
        {saveButtonType !== SaveButtonType.grandTheftAuto && (
          <label className='save-btn_title' htmlFor="">{textfield}</label>
        )}
      </>
    ) : saveButtonType === SaveButtonType.normal ? (
      <>
        <CloudUploadIcon />
        <label className='save-btn_title' htmlFor="">{textfield}</label>
      </>
    ) : saveButtonType === SaveButtonType.grandTheftAuto ? (
        <GtaSaveIcon />
    ) : (
      <>
        <DeleteTemplateIcon />
        <label className='save-btn_title' htmlFor="">{textfield}</label>
      </>
    )}
  </button>
);
