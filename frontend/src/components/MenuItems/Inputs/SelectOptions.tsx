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
};

export const SelectOptions = ({ options, containerClassOverride, selectClassOverride, onChange, value, disabled = false }: Props) => {
    return (
        <div className={"select-wrapper " + (disabled && ' disabled ') + (containerClassOverride || '')}>
            <select value={value} onChange={onChange} className={selectClassOverride}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
