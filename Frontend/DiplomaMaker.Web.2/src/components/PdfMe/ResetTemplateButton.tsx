import { useDesigner } from "../../hooks/useDesigner";

export default function DownloadTemplateButton(classNames?: string) {
    const { onResetTemplate } = useDesigner();

    return (
        <button
            className={classNames ?? ''}
            onClick={onResetTemplate}>
            Download Template
        </button>
    );
}