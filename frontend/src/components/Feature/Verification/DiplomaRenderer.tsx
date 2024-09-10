import { Form, Viewer } from "@pdfme/ui";
import { useEffect, useRef } from "react";
import { HistorySnapshotResponse } from "../../../util/types";
import { getPlugins } from "../../../util/pdfmeUtil";
import { getFontsData } from "../../../util/fontsUtil";
import { mapTemplateInputsToTemplateViewerFromSnapshot, templateInputsFromHistorySnapshot } from "../../../util/dataHelpers";

type Props = {
    uiInstance: React.MutableRefObject<Form | Viewer>;
    studentData: HistorySnapshotResponse;
    displayName: string;
}

export const DiplomaRenderer = ({ studentData, displayName, uiInstance }: Props) => {
    const uiRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(studentData){
            const inputs = templateInputsFromHistorySnapshot(studentData, displayName);
            const template = mapTemplateInputsToTemplateViewerFromSnapshot(studentData, inputs[0])

            getFontsData().then((font) => {
                if(uiInstance.current){
                    uiInstance.current.destroy();
                }
                uiInstance.current = new Viewer({
                    domContainer: uiRef.current,
                    template,
                    inputs,
                    options: { font },
                    plugins: getPlugins()
                });
            })

            return () => {
                if(uiInstance.current){
                    uiInstance.current.destroy();
                    uiInstance.current = null;
                }
            }
            
        }
    }, [uiRef, studentData])

  return (
    <div
        className="pdfpreview-smallcontainer"
        ref={uiRef}
        style={{ width: "100%", height: "100%", marginBottom: '2rem'}}
    />
  );
};