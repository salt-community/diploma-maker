import { AddTemplateIcon } from '../Icons/AddTemplateIcon';
import './AddButton.css'

type Props = {
  onClick: () => void;
};

export const AddButton = ({ onClick }: Props) => (
  <button className={"add-btn "} onClick={onClick}>
      <>
        <AddTemplateIcon />
        <label className='add-btn_title' htmlFor="">New Template</label>
      </>
  </button>
);