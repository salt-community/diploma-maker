import { SelectOptions } from "../../components/MenuItems/Inputs/SelectOptions";
import "./TemplateCreatorPage.css";
import { PdfFileUpload } from "../../components/MenuItems/Inputs/PdfFileUpload";
//@ts-ignore
import { CustomTemplate, TemplateInstanceStyle, TemplateRequest, TemplateResponse} from "../../util/types";
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
import { EditSection } from "../../components/MenuItems/TemplateCreatorPage/EditSection";
import { TextEditSection } from "../../components/MenuItems/TemplateCreatorPage/TextEditSection";
import { HelpIcon } from "../../components/MenuItems/Icons/HelpIcon";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { InstructionSlideshow } from "../../components/Content/InstructionSlideshow";
import { EmailConfigInstructionSlides, templateCreatorInstructionSlides } from "../../data/data";

type Props = {
  templates: TemplateResponse[] | null;
  addNewTemplate: (templateRequest: TemplateRequest) => Promise<void>;
  updateTemplate: (id: number, templateRequest: TemplateRequest) => Promise<TemplateResponse>;
  deleteTemplate: (templateRequest: number) => Promise<void>;
};

export const TemplateCreatorPage = ({ templates, addNewTemplate, updateTemplate, deleteTemplate }: Props) => {
  const [templateData, setTemplateData] = useState<any[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<any | null>(null);

  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);

  const [rightSideBarPage, setRightSideBarPage] = useState<number>(0);

  const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
  const {showConfirmationPopup,confirmationPopupContent,confirmationPopupType,confirmationPopupHandler,customPopup,closeConfirmationPopup} = useCustomConfirmationPopup();

  const [templateHasChanged, setTemplateHasChanged] = useState<boolean>(false);
  const [templateBasePdfHasChanged, settemplateBasePdfHasChanged] = useState<boolean>(false);
  const [fileAdded, setFileAdded] = useState<boolean>(false);
  const [templateAdded, setTemplateAdded] = useState<boolean>(false);

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [fieldWidth, setFieldWidth] = useState<number | null>(null);
  const [fieldHeight, setFieldHeight] = useState<number | null>(null);

  const [showInstructionSlideshow, setShowInstructionSlideshow] = useState<boolean>(false);

  const [templateStyle, setTemplateStyle] = useState<TemplateInstanceStyle>({
    positionX: null,
    positionY: null,
    sizeWidth: null,
    sizeHeight: null,
    align: null,
    fontSize: null,
    font: null,
    fontColor: null,
  });

  const [templateIndex, setTemplateIndex] = useState<number>(0);

  useEffect(() => {
    if (templates && templates.length > 0) {
      const templateData = mapTemplatesToTemplateData(templates);
      setTemplateData(templateData);
      if (templateAdded) {
        setCurrentTemplate(templateData[templateData.length - 1]);
        setTemplateAdded(false);
      } else {
        setCurrentTemplate(templateData[templateIndex] || null);
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
            '.pdfpreview div div div div div[title="link"]',
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
            '.pdfpreview div div div div div[title="link"]',
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
            '.pdfpreview div div div div div[title="link"]',
        ];

        selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.removeEventListener("click", handleFieldClick);
            });
        });
    };
  }, []);


  useEffect(() => {
    if (designer.current && selectedField) {
      // @ts-ignore
      const width: number = designer.current.template.schemas[0][selectedField]?.width ?? null;
      // @ts-ignore
      const height: number = designer.current.template.schemas[0][selectedField]?.height ?? null;
  
      setFieldWidth(width);
      setFieldHeight(height);
    }
  }, [designer.current, selectedField]);

  const handleFieldClickOutside = (event: any) => {
    if (!event.target.closest('.templatecreator-page__rightsidebar-menu')) {
      setTemplateStyle({
        positionX: null,
        positionY: null,
        sizeWidth: null,
        sizeHeight: null,
        align: null,
        fontSize: null,
        font: null,
        fontColor: null,
      });
    }
  }


  const handleFieldClick = (event: any) => {
    const clickedField = event.currentTarget.getAttribute("title");
    setSelectedField(clickedField);
    if (designer.current) {
      // @ts-ignore
      const { position, width, height, alignment, fontSize, fontName, fontColor } = designer.current.template.schemas[0][clickedField];
  
      setTemplateStyle({
        positionX: position.x,
        positionY: position.y,
        sizeWidth: width,
        sizeHeight: height,
        //@ts-ignore
        align: alignment,
        //@ts-ignore
        fontSize: fontSize,
        //@ts-ignore
        font: fontName,
        //@ts-ignore
        fontColor: fontColor,
      });
    }
  };

  const templateChangeHandler = async (index: number) => {
    if (templateHasChanged) {
      shouldWeSaveHandler(index);
    } else {
      setFileAdded(false);
      setCurrentTemplate(templateData[index] || null);
      setTemplateIndex(index);
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
      settemplateBasePdfHasChanged(true);
      setFileAdded(true);
    }
  };

  const saveTemplate = async (goToIndex?: number) => {
    if (currentTemplate) {
      closeConfirmationPopup();
      try {
        await updateTemplate(currentTemplate?.id, 
          templateBasePdfHasChanged 
            ? { ...currentTemplate, PdfBackgroundLastUpdated: new Date() }
            : currentTemplate
        );
        
        customAlert('success',"Template Successfully Updated!",`Successfully updated ${currentTemplate.diplomaTemplateName} to database`);
        setTemplateHasChanged(false);
        if (goToIndex !== undefined) {
          setCurrentTemplate(templateData[goToIndex] || null);
          setTemplateIndex(goToIndex);
          setFileAdded(false);
        }
      } catch (error) {
        customAlert('fail',"Template Update failure!",`${error} when trying to update template.`);
      }
    }
  };

  const addTemplate = async (inputContent?: string) => {
    closeConfirmationPopup();
    if (
      templateData.some((template) => template.templateName === inputContent)
    ) {
      customAlert('fail',"Template Creation failure!",`Name already exists`);
      return;
    }
    if (inputContent && inputContent.trim() != "") {
      try {
        await addNewTemplate(createBlankTemplate(inputContent));
        customAlert('success',"Succesfully added new template!",`Successfully added new template to database.`);
        setTemplateAdded(true);
      } catch (error) {
        customAlert('fail',"Template add failure!",`${error} when trying to add new template to database.`);
      }
    } else {
      customAlert('fail',"Template Creation failure!",`Name field is blank`);
    }
  };

  const removeTemplate = async () => {
    if (currentTemplate?.id) {
      closeConfirmationPopup();
      const templateId = currentTemplate?.id;
      if (templateId === 1) {
        customAlert('fail',`Cannot Delete the Default Template`,`You are not allowed to delete the baseTemplate.`);
        return;
      }
      try {
        await deleteTemplate(templateId);
        setTemplateIndex(0);
        customAlert('fail',"Template Successfully Deleted!", `Successfully deleted ${currentTemplate.templateName} from database`);
        setTemplateHasChanged(false);
      } catch (error) {
        customAlert('fail',"Template Update failure!",`${error} when trying to update template.`);
      }
    }
  };

  const saveFieldsHandler = async () => {
    if (designer.current && currentTemplate) {
      const updatedTemplate = createUpdatedTemplate(currentTemplate, designer);
      await setCurrentTemplate(updatedTemplate);
      setRightSideBarPage(0);
      customAlert('message', "Inputs Saved", `Remember to also save your template for changes to reflect in pdfcreator!`);
    }
  };

  const shouldWeSaveHandler = async (index: number) => {
    customPopup('question', "Do you want to save your changes?", "This will change template for all bootcamps that use this template", () => () => saveTemplate(index));
  };

  const confirmChangeTemplateHandler = async () => {
    const currentTemplateIndex = getTemplateIndex(currentTemplate);
    customPopup('question', "Are you sure you want to save changes to this template?", "This will change template for all bootcamps that use this template", () => () => saveTemplate(currentTemplateIndex));
  };

  const confirmAddNewTemplateHandler = async () => {
    customPopup('form', "What should we name your template?", "Names are echoes of identity, whispers of our soul's melody.", () => (inputContent?: string) => addTemplate(inputContent));
  };

  const confirmRemoveTemplateHandler = async () => {
    customPopup('warning', `Are you sure you want to remove ${currentTemplate?.templateName}?`, "This will unlink the template for all bootcamps that use it.", () => () => removeTemplate());
  };

  const globalAbortHandler = () => {
    closeConfirmationPopup();
  };

  const getTemplateIndex = (template: CustomTemplate | null) => {
    return template ? templateData.findIndex((t) => t.id === template.id) : 0;
  };

  // SideMenu Field Editing Functions
  const setPositionXHandler = async (value: number) => {
    setTemplateStyle(prevState => ({ ...prevState, positionX: value }));
    if (designer.current && selectedField) {
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].position.x = value;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const setPositionYHandler = async (value: number) => {
    setTemplateStyle(prevState => ({ ...prevState, positionY: value }));
    if (designer.current && selectedField) {
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].position.y = value;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const setSizeWidthHandler = async (value: number) => {
    setTemplateStyle(prevState => ({ ...prevState, sizeWidth: value }));
    if (designer.current && selectedField) {
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].width = value;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const setSizeHeightHandler = async (value: number) => {
    setTemplateStyle(prevState => ({ ...prevState, sizeHeight: value }));
    if (designer.current && selectedField) {
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].height = value;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const textAlignHandler = async (value: string) => {
    setTemplateStyle(prevState => ({ ...prevState, align: value }));
    if (designer.current && selectedField) {
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].alignment = value;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const fontSizeHandler = async (value: number) => {
    setTemplateStyle(prevState => ({ ...prevState, fontSize: value }));
    if (designer.current && selectedField) {
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].fontSize = value;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const setFontHandler = async (value: string) => {
    setTemplateStyle(prevState => ({ ...prevState, font: value }));
    if (designer.current && selectedField) {
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].fontName = value;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };
  
  const setFontColorHandler = async (value: string) => {
    setTemplateStyle(prevState => ({ ...prevState, fontColor: value }));
    if (designer.current && selectedField) {
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].fontColor = value;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
    }
  };

  // Hardcoded width value of 215 since i cannot get the width right now of canvas in any other way through pdfme designer
  const setAlignHorizontalCenter = () => {
    if (designer.current && selectedField) {
      // @ts-ignore
      const selectedFieldWidth = designer.current.template.schemas[0][selectedField].width;
      const centerPosition = (215 - selectedFieldWidth) / 2;
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].position.x = centerPosition;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
  
      setTemplateStyle(prevState => ({ ...prevState, positionX: centerPosition }));
    }
  };
  
  const setAlignVerticalCenter = () => {
    if (designer.current && selectedField) {
      // @ts-ignore
      const selectedFieldHeight = designer.current.template.schemas[0][selectedField].height;
      const centerPosition = (305 - selectedFieldHeight) / 2;
      // @ts-ignore
      designer.current.template.schemas[0][selectedField].position.y = centerPosition;
      // @ts-ignore
      designer.current.updateTemplate(designer.current.template);
  
      setTemplateStyle(prevState => ({ ...prevState, positionY: centerPosition }));
    }
  };

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
            confirmClick={(inputContent?: string) => { confirmationPopupHandler(inputContent) }}
        />
        <AlertPopup
            title={popupContent[0]}
            text={popupContent[1]}
            popupType={popupType}
            show={showPopup}
            onClose={closeAlert}
        />
        <InstructionSlideshow show={showInstructionSlideshow}  slides={templateCreatorInstructionSlides} onClose={() => setShowInstructionSlideshow(false)}/>
        <section className="templatecreator-page__leftsidebar">
            <div className="templatecreator-page__leftsidebar-menu">
                <section className="templatecreator-page__leftsidebar-menu-section">
                    <button onClick={() => setShowInstructionSlideshow(true)} className="help-btn">
                        <HelpIcon />
                    </button>
                </section>
            </div>
        </section>
        <section className="templatecreator-page__preview-container">
            <div className="templatecreator-page__preview" style={{ width: "100%", overflow: "hidden", height: `calc(50vh - 68px)` }}>
                <h2>{currentTemplate?.templateName}</h2>
                <div className="pdfpreview" ref={designerRef} style={{ height: `80%` }} onClick={() => setRightSideBarPage(1)} />
                {!templates && <SpinnerDefault classOverride="spinner" />}
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
                                saveButtonType={'normal'}
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
                                positionX={templateStyle.positionX}
                                positionY={templateStyle.positionY}
                                sizeWidth={templateStyle.sizeWidth}
                                sizeHeight={templateStyle.sizeHeight}
                                setPositionX={setPositionXHandler}
                                setPositionY={setPositionYHandler}
                                setSizeWidth={setSizeWidthHandler}
                                setSizeHeight={setSizeHeightHandler}
                                setAlignHorizontalCenter={setAlignHorizontalCenter}
                                setAlignVerticalCenter={setAlignVerticalCenter}
                                fieldWidth={fieldWidth}
                                fieldHeight={fieldHeight}
                            />
                        </section>
                        <section className="templatecreator-page__rightsidebar-menu-section">
                            <h3>Text</h3>
                            <TextEditSection
                                align={templateStyle.align}
                                setAlign={(value: string) => textAlignHandler(value)}
                                fontSize={templateStyle.fontSize}
                                setFontSize={(value: number) => fontSizeHandler(value)}
                                font={templateStyle.font}
                                setFont={(value: string) => setFontHandler(value)}
                                fontColor={templateStyle.fontColor}
                                setFontColor={(value: string) => setFontColorHandler(value)}
                            />
                        </section>
                        <section className="templatecreator-page__rightsidebar-menu-section">
                            <h3>Edit Field {selectedField && selectedField}</h3>
                            <SaveButton
                                textfield="Save Inputs"
                                saveButtonType={'normal'}
                                onClick={saveFieldsHandler}
                                customIcon={<TextInputIcon />}
                            />
                        </section>
                        <section className="templatecreator-page__rightsidebar-menu-section">
                            <SaveButton
                                textfield="Remove Template"
                                saveButtonType={'remove'}
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
