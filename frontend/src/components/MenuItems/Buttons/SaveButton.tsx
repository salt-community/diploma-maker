import { CloudUploadIcon } from '../Icons/CloudUploadIcon';
import { DeleteTemplateIcon } from '../Icons/DeleteTemplateIcon';
import { GtaSaveIcon } from '../Icons/GtaSaveIcon';
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
        <CloudUploadIcon />
        <label className='save-btn_title' htmlFor="">Save Template</label>
      </>
    : saveButtonType === SaveButtonType.grandTheftAuto ?
      <GtaSaveIcon />
    :
      <>
          <DeleteTemplateIcon />
          <label className='save-btn_title' htmlFor="">Remove Template</label>
      </>
    }
    
  </button>
);