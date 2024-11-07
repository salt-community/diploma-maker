import { useDesigner } from "../../hooks/useDesigner";

export default function ChangeBasePdfInput(classNames?: string) {
    const { onChangeBasePdf } = useDesigner();

    return (
        <input
            className={classNames ?? ''}
            type="file"
            accept="application/pdf"
            onChange={onChangeBasePdf} />
    );
}