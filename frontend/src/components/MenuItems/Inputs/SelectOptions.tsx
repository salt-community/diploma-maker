import React from 'react';
import './SelectOptions.css';

type Option = {
    value: string;
    label: string;
};

type Props = {
    containerClassOverride?: string;
    selectClassOverride?: string;
    options: Option[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    disabled?: boolean;
    reactHookForm?: boolean;
    register?: (name: string) => { name: string };
    name?: string;
};

export const SelectOptions = React.forwardRef<HTMLSelectElement, Props>(({ options, containerClassOverride, selectClassOverride, onChange, value, disabled = false, reactHookForm = false, register, name }, ref) => {
    return (
        <div className={"select-wrapper " + (disabled ? ' disabled ' : '') + (containerClassOverride || '')}>
            {reactHookForm && register && name ? (
                <select value={value} onChange={onChange} className={selectClassOverride} {...register(name)} ref={ref}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <select value={value} onChange={onChange} className={selectClassOverride} ref={ref}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
  }
);
