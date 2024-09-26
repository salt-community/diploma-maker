import { EmailIcon } from '../Icons/EmailIcon';
import './SelectButton.css';

type Props = {
  classOverride?: string;
  onClick: () => void;
  selectButtonType: SelectButtonType;
  textfield?: string;
};
export type SelectButtonType = 'email';

export const SelectButton = ({ classOverride, onClick, selectButtonType }: Props) => (
  <button className={"select-btn " + (selectButtonType === 'email' && 'email ') + (classOverride && classOverride)} onClick={onClick}>
    {selectButtonType === 'email' && 
      <EmailIcon />
    }
  </button>
);
