import { CloudUploadIcon } from '../Icons/CloudUploadIcon';
import { DeleteTemplateIcon } from '../Icons/DeleteTemplateIcon';
import { GtaSaveIcon } from '../Icons/GtaSaveIcon';
import './SaveButton.css';

type Props = {
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

export const SaveButton = ({ onClick, saveButtonType, textfield, customIcon }: Props) => (
  <button className={"save-btn " + (saveButtonType === SaveButtonType.grandTheftAuto ? 'gta' : saveButtonType === SaveButtonType.remove ? 'remove' : 'normal')} onClick={onClick}>
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
