import React from 'react';
import './SwitchComponent.css';

interface SwitchComponentProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

export const SwitchComponent: React.FC<SwitchComponentProps> = ({ checked, onToggle }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target.checked);
  };

  return (
    <div className="checkbox-wrapper-35">
      <input
        value="private"
        name="switch"
        id="switch"
        type="checkbox"
        className="switch"
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor="switch">
        <span className="switch-x-text">Edit Mode </span>
        <span className="switch-x-toggletext">
          <span className="switch-x-unchecked"><span className="switch-x-hiddenlabel"></span>Off</span>
          <span className="switch-x-checked"><span className="switch-x-hiddenlabel"></span>On</span>
        </span>
      </label>
    </div>
  );
};
