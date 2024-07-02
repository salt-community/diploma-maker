import React from 'react';
import './CustomCheckBoxRound.css';
import { CircleIcon } from '../Icons/CircleIcon';

type Props = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomCheckBoxRound = ({ checked, onChange }: Props) => {
  return (
    <div className="checkbox-wrapper-31">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
      />
      <CircleIcon />
    </div>
  );
};

export default CustomCheckBoxRound;
