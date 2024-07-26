import { AddTemplateIcon } from '../Icons/AddTemplateIcon';
import './AddButton.css';

type Props = {
  onClick: () => void;
  text?: string;
  icon?: React.ReactNode;
};

export const AddButton = ({ onClick, text = "New Template", icon }: Props) => (
  <button className={"add-btn "} onClick={onClick}>
      <>
        {icon || <AddTemplateIcon />}
        <label className='add-btn_title' htmlFor="">{text}</label>
      </>
  </button>
);