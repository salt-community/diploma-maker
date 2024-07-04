import { SelectOptions } from "../../components/MenuItems/Inputs/SelectOptions";
import "./TemplateCreatorPage.css";
import { PdfFileUpload } from "../../components/MenuItems/Inputs/PdfFileUpload";
import { CustomTemplate, TemplateRequest, TemplateResponse,} from "../../util/types";
import { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import { cloneDeep, getFontsData, getPlugins } from "../../util/helper";
import { makeTemplateInput } from "../../templates/baseTemplate";
import { PDFDocument } from "pdf-lib";
import { SaveButton, SaveButtonType,} from "../../components/MenuItems/Buttons/SaveButton";
import { AddButton } from "../../components/MenuItems/Buttons/AddButton";
import { ConfirmationPopup, ConfirmationPopupType } from "../../components/MenuItems/Popups/ConfirmationPopup";
import { AlertPopup, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { TextInputIcon } from "../../components/MenuItems/Icons/TextInputIcon";
import { createBlankTemplate, createUpdatedTemplate, mapTemplateInputsToTemplateDesigner, mapTemplatesToTemplateData} from "../../util/dataHelpers";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { useCustomConfirmationPopup } from "../../components/Hooks/useCustomConfirmationPopup";
import { EditSection } from "../../components/MenuItems/Inputs/EditSection";
import { TextEditSection } from "../../components/MenuItems/Inputs/TextEditSection";

type Props = {
  templates: TemplateResponse[] | null;
  addNewTemplate: (templateRequest: TemplateRequest) => Promise<void>;
  updateTemplate: (id: number,templateRequest: TemplateRequest) => Promise<TemplateResponse>;
  deleteTemplate: (templateRequest: number) => Promise<void>;
};

export const TemplateCreatorPage = ({ templates, addNewTemplate, updateTemplate, deleteTemplate }: Props) => {
  const [templateData, setTemplateData] = useState<CustomTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<CustomTemplate | null>(null);

  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);

  const [rightSideBarPage, setRightSideBarPage] = useState<number>(0);
  const [leftSideBarPage, setLeftSideBarPage] = useState<number>(0);

  const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
  const {showConfirmationPopup,confirmationPopupContent,confirmationPopupType,confirmationPopupHandler,customPopup,closeConfirmationPopup} = useCustomConfirmationPopup();

  const [templateHasChanged, setTemplateHasChanged] = useState<boolean>(false);
  const [fileAdded, setFileAdded] = useState<boolean>(false);
  const [templateAdded, setTemplateAdded] = useState<boolean>(false);

  const [positionX, setPositionX] = useState<number | null>(null);
  const [positionY, setPositionY] = useState<number | null>(null);
  const [sizeWidth, setSizeWidth] = useState<number | null>(null);
  const [sizeHeight, setSizeHeight] = useState<number | null>(null);
  const [align, setAlign] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [font, setFont] = useState<string | null>(null);
  const [fontColor, setFontColor] = useState<string | null>(null);

  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (templates && templates.length > 0) {
      const templateData = mapTemplatesToTemplateData(templates);

      setTemplateData(templateData);
      if (templateAdded) {
        setCurrentTemplate(templateData[templateData.length - 1]);
        setTemplateAdded(false);
      } else {
        setCurrentTemplate(templateData[0] || null);
      }
    }
  }, [templates]);

  useEffect(() => {
    if (currentTemplate) {
      const inputs = [
        makeTemplateInput(
          currentTemplate.intro,
          currentTemplate.main,
          currentTemplate.footer,
          currentTemplate.basePdf
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

  // Right Now I Literally cannot get the name of which field the user has clicked on in any other way... Temporary Solution!
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const selectors = [
            '.pdfpreview div div div div div[title="header"]',
            '.pdfpreview div div div div div[title="main"]',
            '.pdfpreview div div div div div[title="footer"]',
        ];

        const isClickInside = selectors.some(selector => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).some(element => element.contains(event.target as Node));
        });

        if (!isClickInside) {
            handleFieldClickOutside(event);
        }
    };

    const attachListeners = () => {
        const selectors = [
            '.pdfpreview div div div div div[title="header"]',
            '.pdfpreview div div div div div[title="main"]',
            '.pdfpreview div div div div div[title="footer"]',
        ];

        selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.removeEventListener("click", handleFieldClick);
                element.addEventListener("click", handleFieldClick);
            });
        });
    };

    const observer = new MutationObserver(() => {
        attachListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    attachListeners();

    document.addEventListener('click', handleClickOutside);

    return () => {
        observer.disconnect();
        document.removeEventListener('click', handleClickOutside);
        const selectors = [
            '.pdfpreview div div div div div[title="header"]',
            '.pdfpreview div div div div div[title="main"]',
            '.pdfpreview div div div div div[title="footer"]',
        ];

        selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.removeEventListener("click", handleFieldClick);
            });
        });
    };
  }, []);

  const handleFieldClickOutside = (event: any) => {
    if (!event.target.closest('.templatecreator-page__rightsidebar-menu')) {
      setPositionX(null);
      setPositionY(null);
      setSizeWidth(null);
      setSizeHeight(null);
      setAlign(null);
      setFontSize(null);
      setFont(null);
      setFontColor(null);
    }
  }


  const handleFieldClick = (event: any) => {
    const clickedField = event.currentTarget.getAttribute("title");
    setSelectedField(clickedField);
    if(designer.current){                                                                       // @ts-ignore
        const posX: number = designer.current.template.schemas[0][clickedField].position.x;     // @ts-ignore
        const posY: number = designer.current.template.schemas[0][clickedField].position.y;     // @ts-ignore
        const width: number = designer.current.template.schemas[0][clickedField].width;         // @ts-ignore
        const height: number = designer.current.template.schemas[0][clickedField].height;       // @ts-ignore
        const alignment: string = designer.current.template.schemas[0][clickedField].alignment; // @ts-ignore
        const fontScale: number = designer.current.template.schemas[0][clickedField].fontSize;  // @ts-ignore
        const font: string = designer.current.template.schemas[0][clickedField].fontmain;       // @ts-ignore
        const fontcolor: string = designer.current.template.schemas[0][clickedField].fontColor; // @ts-ignore
    
        setPositionX(posX);
        setPositionY(posY);
        setSizeWidth(width);
        setSizeHeight(height);
        setAlign(alignment);
        setFontSize(fontScale);
        setFont(font);
        setFontColor(fontcolor);
    }
  };

  const templateChangeHandler = async (index: number) => {
    if (templateHasChanged) {
      shouldWeSaveHandler(index);
    } else {
      setFileAdded(false);
      setCurrentTemplate(templateData[index] || null);
    }
  };

  const pdfFileUploadHandler = async (file: File) => {
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const finalFile = await PDFDocument.create();
      const [firstPage] = await finalFile.copyPages(pdfDoc, [0]);

      finalFile.addPage(firstPage);
      const basePdf = await finalFile.saveAsBase64({ dataUri: true });

      if (designer.current) {
        designer.current.updateTemplate(
          Object.assign(cloneDeep(designer.current.getTemplate()), {
            basePdf,
          })
        );
      }
      if (currentTemplate) {
        const updatedTemplate = { ...currentTemplate, basePdf };
        setCurrentTemplate(updatedTemplate);

        const updatedTemplateData = templateData.map((template) =>
          template.id === currentTemplate.id ? updatedTemplate : template
        );
        setTemplateData(updatedTemplateData);
      }
      setTemplateHasChanged(true);
      setFileAdded(true);
    }
  };

  const saveTemplate = async (goToIndex?: number) => {
    if (currentTemplate) {
      closeConfirmationPopup();
      try {
        await updateTemplate(currentTemplate?.id, currentTemplate);
        customAlert(PopupType.success,"Template Successfully Updated!",`Successfully updated ${currentTemplate.diplomaTemplateName} to database`);
        setTemplateHasChanged(false);
        if (goToIndex !== undefined) {
          setCurrentTemplate(templateData[goToIndex] || null);
          setFileAdded(false);
        }
      } catch (error) {
        customAlert(PopupType.fail,"Template Update failure!",`${error} when trying to update template.`);
      }
    }
  };

  const addTemplate = async (inputContent?: string) => {
    closeConfirmationPopup();
    if (
      templateData.some((template) => template.templateName === inputContent)
    ) {
      customAlert(PopupType.fail,"Template Creation failure!",`Name already exists`);
      return;
    }
    if (inputContent && inputContent.trim() != "") {
      try {
        await addNewTemplate(createBlankTemplate(inputContent));
        customAlert(PopupType.success,"Succesfully added new template!",`Successfully added new template to database.`);
        setTemplateAdded(true);
      } catch (error) {
        customAlert(PopupType.fail,"Template add failure!",`${error} when trying to add new template to database.`);
      }
    } else {
      customAlert(PopupType.fail,"Template Creation failure!",`Name field is blank`);
    }
  };

  const removeTemplate = async () => {
    if (currentTemplate?.id) {
      closeConfirmationPopup();
      const templateId = currentTemplate?.id;
      if (templateId === 1) {
        customAlert(PopupType.fail,`Cannot Delete the Default Template`,`You are not allowed to delete the baseTemplate.`);
        return;
      }
      try {
        await deleteTemplate(templateId);
        customAlert(PopupType.fail,"Template Successfully Deleted!", `Successfully deleted ${currentTemplate.templateName} from database`);
        setTemplateHasChanged(false);
      } catch (error) {
        customAlert(PopupType.fail,"Template Update failure!",`${error} when trying to update template.`);
      }
    }
  };

  const saveFieldsHandler = async () => {
    if (designer.current && currentTemplate) {
      const updatedTemplate = createUpdatedTemplate(currentTemplate, designer);
      await setCurrentTemplate(updatedTemplate);
      setRightSideBarPage(0);
      customAlert(PopupType.message, "Inputs Saved", `Remember to also save your template for changes to reflect in pdfcreator!`);
    }
  };

  const shouldWeSaveHandler = async (index: number) => {
    customPopup(
      ConfirmationPopupType.question, "Do you want to save your changes?", "This will change template for all bootcamps that use this template", () => () => saveTemplate(index)
    );
  };

  const confirmChangeTemplateHandler = async () => {
    customPopup(
      ConfirmationPopupType.question, "Are you sure you want to save changes to this template?", "This will change template for all bootcamps that use this template", () => saveTemplate
    );
  };

  const confirmAddNewTemplateHandler = async () => {
    customPopup(
      ConfirmationPopupType.form, "What should we name your template?", "Names are echoes of identity, whispers of our soul's melody.", () => (inputContent?: string) => addTemplate(inputContent)
    );
  };

  const confirmRemoveTemplateHandler = async () => {
    customPopup(
      ConfirmationPopupType.warning, `Are you sure you want to remove ${currentTemplate?.templateName}?`, "This will unlink the template for all bootcamps that use it.", () => () => removeTemplate()
    );
  };

  const globalAbortHandler = () => {
    closeConfirmationPopup();
  };

  const getTemplateIndex = (template: CustomTemplate | null) => {
    return template ? templateData.findIndex((t) => t.id === template.id) : 0;
  };

  const setPositionXHandler = async (value: number) => {
    setPositionX(value);
    if (designer.current && selectedField) {                                    // @ts-ignore
      designer.current.template.schemas[0][selectedField].position.x = value;   // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const setPositionYHandler = async (value: number) => {
    setPositionY(value);
    if (designer.current && selectedField) {                                    // @ts-ignore
      designer.current.template.schemas[0][selectedField].position.y = value;   // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const setSizeWidthHandler = async (value: number) => {
    setSizeWidth(value);
    if (designer.current && selectedField) {                                    // @ts-ignore
      designer.current.template.schemas[0][selectedField].width = value;        // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const setSizeHeightHandler = async (value: number) => {
    setSizeHeight(value);
    if (designer.current && selectedField) {                                    // @ts-ignore
      designer.current.template.schemas[0][selectedField].height = value;       // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };

  const textAlignHandler = async (value: string) => {
    setAlign(value);
    if (designer.current && selectedField) {                                    // @ts-ignore
      designer.current.template.schemas[0][selectedField].alignment = value;    // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };

  const fontSizeHandler = async (value: number) => {
    setFontSize(value);
    if (designer.current && selectedField) {                                    // @ts-ignore
      designer.current.template.schemas[0][selectedField].fontSize = value;     // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };

  const setFontHandler = async (value: string) => {
    setFont(value);
    if (designer.current && selectedField) {                                    // @ts-ignore
      designer.current.template.schemas[0][selectedField].fontmain = value;     // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  }

  const setFontColorHandler = async (value: string) => {
    setFontColor(value);
    if (designer.current && selectedField) {                                    // @ts-ignore
      designer.current.template.schemas[0][selectedField].fontColor = value;    // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  }

  return (
    <main className="templatecreator-page">
      <div className="bg-boundingbox" onClick={() => setRightSideBarPage(0)}></div>
      <ConfirmationPopup
        title={confirmationPopupContent[0]}
        text={confirmationPopupContent[1]}
        show={showConfirmationPopup}
        confirmationPopupType={confirmationPopupType}
        abortClick={() => globalAbortHandler()}
        // @ts-ignore
        confirmClick={(inputContent?: string) =>confirmationPopupHandler()}
      />
      <AlertPopup
        title={popupContent[0]}
        text={popupContent[1]}
        popupType={popupType}
        show={showPopup}
        onClose={closeAlert}
      />
      <section className="templatecreator-page__leftsidebar">
        <div className="templatecreator-page__leftsidebar-menu">
          <header className="templatecreator-page__leftsidebar-menu-header">
            <button
              onClick={() => setLeftSideBarPage(0)}
              className={leftSideBarPage === 0 ? "active" : ""}
            >
              _
            </button>
            {/* <button onClick={() => setLeftSideBarPage(1)} className={leftSideBarPage === 1 ? 'active' : ''}>
                            -
                        </button> */}
          </header>
          {leftSideBarPage === 0 && (
            <>
              <section className="templatecreator-page__leftsidebar-menu-section">
                <h3></h3>
              </section>
            </>
          )}
          {leftSideBarPage === 1 && (
            <>
              <section className="templatecreator-page__leftsidebar-menu-section">
                <h3></h3>
              </section>
            </>
          )}
        </div>
      </section>
      <section className="templatecreator-page__preview-container">
        <div className="templatecreator-page__preview" style={{width: "100%",overflow: "hidden",height: `calc(50vh - 68px)`,}}>
          <h2>{currentTemplate?.templateName}</h2>
          <div className="pdfpreview" ref={designerRef} style={{ height: `80%` }} onClick={() => setRightSideBarPage(1)}/>
        </div>
      </section>
      <section className="templatecreator-page__rightsidebar">
        <div className="templatecreator-page__rightsidebar-menu">
          <header className="templatecreator-page__rightsidebar-menu-header">
            <button onClick={() => setRightSideBarPage(0)} className={rightSideBarPage === 0 ? "active" : ""}>
              Browse
            </button>
            <button onClick={() => setRightSideBarPage(1)} className={rightSideBarPage === 1 ? "active" : ""}>
              Edit
            </button>
          </header>
          {rightSideBarPage === 0 && (
            <>
              <section className="templatecreator-page__rightsidebar-menu-section">
                <h3>Templates</h3>
                <SelectOptions
                  containerClassOverride="overview-page__select-container"
                  selectClassOverride="overview-page__select-box"
                  options={templateData.map((template, index) => ({
                    value: index.toString(),
                    label: template.templateName,
                  }))}
                  value={getTemplateIndex(currentTemplate).toString()}
                  onChange={(event) =>
                    templateChangeHandler(Number(event.target.value))
                  }
                />
              </section>
              <section className="templatecreator-page__rightsidebar-menu-section">
                <h3>Add Template</h3>
                <AddButton onClick={confirmAddNewTemplateHandler} />
              </section>
              <section className="templatecreator-page__rightsidebar-menu-section">
                <h3>Add PDF Background</h3>
                <PdfFileUpload
                  fileResult={(file: File) => pdfFileUploadHandler(file)}
                  fileAdded={fileAdded}
                  setFileAdded={setFileAdded}
                />
              </section>
              <section className="templatecreator-page__rightsidebar-menu-section">
                <SaveButton
                  textfield="Save Template"
                  saveButtonType={SaveButtonType.normal}
                  onClick={confirmChangeTemplateHandler}
                />
              </section>
            </>
          )}
          {rightSideBarPage === 1 && (
            <>
              <section className="templatecreator-page__rightsidebar-menu-section">
                <h3>Layout</h3>
                <EditSection
                    positionX={positionX}
                    positionY={positionY}
                    sizeWidth={sizeWidth}
                    sizeHeight={sizeHeight}
                    setPositionX={setPositionXHandler}
                    setPositionY={setPositionYHandler}
                    setSizeWidth={setSizeWidthHandler}
                    setSizeHeight={setSizeHeightHandler}
                />
              </section>
              <section className="templatecreator-page__rightsidebar-menu-section">
                <h3>Text</h3>
                <TextEditSection
                  align={align}
                  setAlign={(value: string) => textAlignHandler(value)}
                  fontSize={fontSize}setFontSize={(value: number) => fontSizeHandler(value)}
                  font={font}
                  setFont={(value: string) => setFontHandler(value)}
                  fontColor={fontColor}
                  setFontColor={(value: string) => setFontColorHandler(value)}
                />
              </section>
              <section className="templatecreator-page__rightsidebar-menu-section">
                <h3>Edit Field {selectedField && selectedField}</h3>
                <SaveButton
                  textfield="Save Inputs"
                  saveButtonType={SaveButtonType.normal}
                  onClick={saveFieldsHandler}
                  customIcon={<TextInputIcon />}
                />
              </section>
              <section className="templatecreator-page__rightsidebar-menu-section">
                <SaveButton
                  textfield="Remove Template"
                  saveButtonType={SaveButtonType.remove}
                  onClick={confirmRemoveTemplateHandler}
                />
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
};
