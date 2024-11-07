import { useDesigner } from "../../hooks/useDesigner";

export default function DownloadTemplateButton(classNames?: string) {
    const { onDownloadTemplate } = useDesigner();

    return (
        <button
            className={classNames ?? ''}
            onClick={onDownloadTemplate}>
            Download Template
        </button>
    );
}