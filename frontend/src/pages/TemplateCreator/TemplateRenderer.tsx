import { RefObject, useEffect } from "react";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { makeTemplateInput } from "../../templates/baseTemplate";
import { mapTemplateInputsToTemplateDesigner } from "../../util/dataHelpers";
import { getFontsData } from "../../util/fontsUtil";
import { Designer } from "@pdfme/ui";
import { getPlugins } from "../../util/pdfmeUtil";

type Props = {
    designer: React.MutableRefObject<Designer>;
    designerRef: RefObject<HTMLDivElement>;
    templates: any;
    setRightSideBarPage: (page: number) => void;
    currentTemplate: any;
    SetPdfSizeHandler: () => Promise<void>;
    firstRun: boolean;
    setFirstRun: (value: React.SetStateAction<boolean>) => void;
    customAlert: (alertType: PopupType, title: string, content: string) => void,
    fieldsChanged: boolean;
};

export const TemplateRenderer = ({
  designer,
  designerRef, 
  templates, 
  setRightSideBarPage,
  currentTemplate,
  SetPdfSizeHandler,
  fieldsChanged,
  customAlert,
  firstRun,
  setFirstRun,
}: Props) => {
  
  useEffect(() => {
    if (currentTemplate) {
      firstRun && customAlert('loading', `Loading Template Into Renderer...`, '')
      SetPdfSizeHandler();
      const inputs = [
        makeTemplateInput(
          currentTemplate.intro,
          currentTemplate.main,
          currentTemplate.footer,
          currentTemplate.basePdf,
          currentTemplate.link
        ),
      ];
      const template = mapTemplateInputsToTemplateDesigner(
        currentTemplate,
        inputs[0]
      );

      getFontsData().then((font) => {
        if (designerRef.current) {
          if (designer.current) {
            designer.current.destroy();
          }
          designer.current = new Designer({
            domContainer: designerRef.current,
            template,
            options: { font },
            plugins: getPlugins(),
          });

          fieldsChanged 
            ? customAlert('loadingfadeout', `Saving Fields...`, '') 
            : customAlert('loadingfadeout', `Loaded: Waiting For Renderer...`, '')

          setFirstRun(false);
        }
      });

      return () => {
        if (designer.current) {
          designer.current.destroy();
          designer.current = null;
        }
      };
    }
  }, [currentTemplate]);
  
  
  return (
    <section className="templatecreator-page__preview-container">
      <div className="templatecreator-page__preview" style={{ width: "100%", overflow: "hidden", height: `calc(50vh - 68px)` }}>
          <div className="pdfpreview" ref={designerRef} style={{ height: `80%` }} onClick={() => setRightSideBarPage(1)} />
          {!templates && <SpinnerDefault classOverride="spinner" />}
      </div>
    </section>
  );
};