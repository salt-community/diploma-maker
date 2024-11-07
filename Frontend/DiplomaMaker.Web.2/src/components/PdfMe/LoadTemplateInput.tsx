import { useDesigner } from "../../hooks/useDesigner";

export default function LoadTemplateInput(classNames?: string) {
    const { handleLoadTemplate } = useDesigner();

    return (
        <input
            className={classNames ?? ''}
            type="file"
            accept="application/json"
            onChange={handleLoadTemplate} />
    );
}