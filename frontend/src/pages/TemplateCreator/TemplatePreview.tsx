import { RefObject } from "react";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";

type Props = {
    designerRef: RefObject<HTMLDivElement>;
    templates: any;
    setRightSideBarPage: (page: number) => void;
};

export const TemplatePreview = ({ designerRef, templates, setRightSideBarPage }: Props) => {
  return (
    <div className="templatecreator-page__preview" style={{ width: "100%", overflow: "hidden", height: `calc(50vh - 68px)` }}>
        <div className="pdfpreview" ref={designerRef} style={{ height: `80%` }} onClick={() => setRightSideBarPage(1)} />
        {!templates && <SpinnerDefault classOverride="spinner" />}
    </div>
  );
};