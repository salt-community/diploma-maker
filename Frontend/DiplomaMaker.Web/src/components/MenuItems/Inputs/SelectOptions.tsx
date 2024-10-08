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
    defaultValue?: string;
    disabled?: boolean;
    reactHookForm?: boolean;
    register?: (name: string) => { name: string };
    name?: string;
    testIdentifier?: string;
};

export const SelectOptions = React.forwardRef<HTMLSelectElement, Props>(({ options, containerClassOverride, selectClassOverride, onChange, value, defaultValue, disabled = false, reactHookForm = false, register, name, testIdentifier }, ref) => {
    return (
        <div className={"select-wrapper " + (disabled ? ' disabled ' : '') + (containerClassOverride || '')}>
            {reactHookForm && register && name ? (
                <select defaultValue={defaultValue} value={value} onChange={onChange} className={selectClassOverride} {...register(name)} ref={ref} test-identifier={testIdentifier}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <select value={value} onChange={onChange} className={selectClassOverride} ref={ref} test-identifier={testIdentifier}>
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
