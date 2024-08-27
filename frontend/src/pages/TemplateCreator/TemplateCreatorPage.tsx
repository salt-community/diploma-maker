import "./TemplateCreatorPage.css";
//@ts-ignore
import { CustomTemplate, TemplateInstanceStyle, TemplateRequest, TemplateResponse, UserFontRequestDto, XYPosition} from "../../util/types";
import { SelectOptions } from "../../components/MenuItems/Inputs/SelectOptions";
import { PdfFileUpload } from "../../components/MenuItems/Inputs/PdfFileUpload";
import { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import { SaveButton} from "../../components/MenuItems/Buttons/SaveButton";
import { AddButton } from "../../components/MenuItems/Buttons/AddButton";
import { ConfirmationPopup } from "../../components/MenuItems/Popups/ConfirmationPopup";
import { AlertPopup } from "../../components/MenuItems/Popups/AlertPopup";
import { TextInputIcon } from "../../components/MenuItems/Icons/TextInputIcon";
import { createBlankTemplate, createUpdatedTemplate, mapTemplatesToTemplateData} from "../../util/dataHelpers";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { useCustomConfirmationPopup } from "../../components/Hooks/useCustomConfirmationPopup";
import { EditSection } from "../../components/MenuItems/TemplateCreatorPage/EditSection";
import { TextEditSection } from "../../components/MenuItems/TemplateCreatorPage/TextEditSection";
import { HelpIcon } from "../../components/MenuItems/Icons/HelpIcon";
import { InstructionSlideshow } from "../../components/Content/InstructionSlideshow";
import { Size } from "@pdfme/common";
import { UserFontsClient } from "../../components/Feature/TemplateCreator/UserFontsClient";
import { FontsIcon } from "../../components/MenuItems/Icons/FontsIcon";
import { delay } from "../../util/timeUtil";
import { getPdfDimensions } from "../../util/fileGetUtil";
import { cloneDeep } from "../../util/fileActionUtil";
import { fontSizeHandler, setAlignHorizontalCenter, setAlignVerticalCenter, setFieldEditorDisplayWidthHeight, setFontColorHandler, setFontHandler, setPositionXHandler, setPositionYHandler, setSizeHeightHandler, setSizeWidthHandler, textAlignHandler } from "./templateCreatorMutators";
import { TemplateRenderer } from "../../components/Feature/TemplateCreator/TemplateRenderer";
import { setFieldEventListeners } from "./templateCreatorFieldEventListeners";
import { handleFieldMouseEvents } from "./templateCreatorFieldMouseEvents";
import { nullTemplateInstance, templateCreatorInstructionSlides } from "../../data/data";
import { EditorLeftSideBar } from "../../components/Feature/TemplateCreator/EditorLeftSideBar";
import { EditorRightSidebar } from "../../components/Feature/TemplateCreator/EditorRightSideBar/EditorRightSidebar";

type Props = {
  templates: TemplateResponse[] | null;
  addNewTemplate: (templateRequest: TemplateRequest) => Promise<void>;
  updateTemplate: (id: number, templateRequest: TemplateRequest) => Promise<TemplateResponse>;
  deleteTemplate: (templateRequest: number) => Promise<void>;
  postUserFonts: (userFontsRequestsDto: UserFontRequestDto[]) => void;
};

export const TemplateCreatorPage = ({ templates, addNewTemplate, updateTemplate, deleteTemplate, postUserFonts }: Props) => {
  const [templateData, setTemplateData] = useState<any[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<any | null>(null);

  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);

  const [rightSideBarPage, setRightSideBarPage] = useState<number>(0);

  const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
  const {showConfirmationPopup, confirmationPopupContent, confirmationPopupType, confirmationPopupHandler, customPopup, closeConfirmationPopup} = useCustomConfirmationPopup();

  const [templateHasChanged, setTemplateHasChanged] = useState<boolean>(false);
  const [templateBasePdfHasChanged, settemplateBasePdfHasChanged] = useState<boolean>(false);
  const [fileAdded, setFileAdded] = useState<boolean>(false);
  const [templateAdded, setTemplateAdded] = useState<boolean>(false);

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [fieldWidth, setFieldWidth] = useState<number | null>(null);
  const [fieldHeight, setFieldHeight] = useState<number | null>(null);
  const [fieldsChanged, setFieldsChanged] = useState<boolean>(false);
  const [currentFieldPostion, setCurrentFieldPosition] = useState<XYPosition>(null);

  const [pdfSize, setPdfSize] = useState<Size>();

  const [showInstructionSlideshow, setShowInstructionSlideshow] = useState<boolean>(false);
  const [showUserFontsClient, setShowUserFontsClient] = useState<boolean>(false);

  const [firstRun, setFirstRun] = useState<boolean>(true)
  const [resetFileUpload, setResetFileUpload] = useState<boolean>(false);

  const [refreshFonts, setRefreshFonts] = useState<boolean>(false);

  const [templateStyle, setTemplateStyle] = useState<TemplateInstanceStyle>(nullTemplateInstance);

  const [templateIndex, setTemplateIndex] = useState<number>(0);

  useEffect(() => {
    firstRun && customAlert('loadingfadeout', `Fetching Templates...`, '')
    if (templates && templates.length > 0) {
      const templateData = mapTemplatesToTemplateData(templates);
      setTemplateData(templateData);
      if (templateAdded) {
        setCurrentTemplate(templateData[templateData.length - 1]);
        setTemplateAdded(false);
      } else {
        setCurrentTemplate(templateData[templateIndex] || null);
      }
      firstRun && customAlert('loading', `Templates Fetched successfully`, '')
    }
  }, [templates]);

  const SetPdfSizeHandler = async () => setPdfSize(await getPdfDimensions(currentTemplate.basePdf));
  const getTemplateIndex = (template: CustomTemplate | null) => template ? templateData.findIndex((t) => t.id === template.id) : 0;

  // - i set event listeners for those specific divs... Right Now I Literally cannot get the name of which field the user has clicked on unless i do this  
  // - Temporary Solution! - Please feel free to find a better way!
  useEffect(() => {
    const cleanup = setFieldEventListeners(
      handleFieldClick, 
      handleFieldClickOutside
    );
    return cleanup;
  }, []);

  const handleFieldClickOutside = (event: any) => !event.target.closest('.templatecreator-page__rightsidebar-menu') && setTemplateStyle(nullTemplateInstance);

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

  // When you drag field and release Mouse it updates field values
  useEffect(() => {
    const cleanup = handleFieldMouseEvents(
      designer,
      selectedField,
      setFieldsChanged,
      setCurrentFieldPosition,
      setTemplateStyle,
      delay
    );
  
    return cleanup;
  }, [designer.current, selectedField]);

  useEffect(() => {
    (designer.current && selectedField) && setFieldEditorDisplayWidthHeight(designer, selectedField, setFieldWidth, setFieldHeight)
  }, [designer.current, selectedField]);


  const templateChangeHandler = async (index: number) => {
    if (templateHasChanged) {
      shouldWeSaveHandler(index);
    } else {
      setFileAdded(false);
      setCurrentTemplate(templateData[index] || null);
      setTemplateIndex(index);
      setResetFileUpload(true);
    }
  };

  const saveTemplate = async (goToIndex?: number) => {
    if (currentTemplate) {
      closeConfirmationPopup();
      customAlert('loading',"Saving Template...",``);
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
          setResetFileUpload(true);
        }
      } catch (error) {
        customAlert('fail',"Template Update failure!",`${error} when trying to update template.`);
      }
    }
  };

  const addTemplate = async (inputContent?: string) => {
    closeConfirmationPopup();
    customAlert('loading',"Adding new template...",``);
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
        setResetFileUpload(true);
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
      customAlert('loading',"Removing Template...",``);
      const templateId = currentTemplate?.id;
      if (templateId === 1) {
        customAlert('fail',`Cannot Delete the Default Template`,`You are not allowed to delete the baseTemplate.`);
        return;
      }
      try {
        await deleteTemplate(templateId);
        setTemplateIndex(0);
        customAlert('message',"Template Successfully Deleted!", `Successfully deleted ${currentTemplate.templateName} from database`);
        setTemplateHasChanged(false);
        setResetFileUpload(true);
      } catch (error) {
        customAlert('fail',"Template Update failure!",`${error} when trying to update template.`);
      }
    }
  };

  const saveFieldsHandler = async () => {
    if (designer.current && currentTemplate && fieldsChanged) {
      customAlert('loading',"Saving Fields...",``);
      const updatedTemplate = createUpdatedTemplate(currentTemplate, designer);
      await setCurrentTemplate(updatedTemplate);
      setRightSideBarPage(0);
      customAlert('message', "Inputs Saved", `Remember to also save your template for changes to reflect in pdfcreator!`);
      setFieldsChanged(false);
    }
  };

  const pdfFileUploadHandler = (base64Pdf: string) => {
    if (designer.current) {
      designer.current.updateTemplate(
        Object.assign(cloneDeep(designer.current.getTemplate()), {
          basePdf: base64Pdf,
        })
      );
    }
    if (currentTemplate) {
      const updatedTemplate = { ...currentTemplate, basePdf: base64Pdf };
      setCurrentTemplate(updatedTemplate);
  
      const updatedTemplateData = templateData.map((template) =>
        template.id === currentTemplate.id ? updatedTemplate : template
      );
      setTemplateData(updatedTemplateData);
    }
    setTemplateHasChanged(true);
    settemplateBasePdfHasChanged(true);
    setFileAdded(true);
  };

  const confirmChangeTemplateHandler = async () => {
    const currentTemplateIndex = getTemplateIndex(currentTemplate);
    customPopup('question', "Are you sure you want to save changes to this template?", "This will change template for all bootcamps that use this template", () => () => saveTemplate(currentTemplateIndex));
  };
  const shouldWeSaveHandler = async (index: number) => customPopup('question', "Do you want to save your changes?", "This will change template for all bootcamps that use this template", () => () => saveTemplate(index));
  const confirmAddNewTemplateHandler = async () => customPopup('form', "What should we name your template?", "Names are echoes of identity, whispers of our soul's melody.", () => (inputContent?: string) => addTemplate(inputContent));
  const confirmRemoveTemplateHandler = async () => customPopup('warning', `Are you sure you want to remove ${currentTemplate?.templateName}?`, "This will unlink the template for all bootcamps that use it.", () => () => removeTemplate());
  const globalAbortHandler = () => closeConfirmationPopup();

  return (
    <main className="templatecreator-page">
        <div className="bg-boundingbox" onClick={() => {setRightSideBarPage(0); saveFieldsHandler();}}></div>
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
        <UserFontsClient 
          type="addNewFont"
          show={showUserFontsClient}
          setShowUserFontsClient={setShowUserFontsClient}
          customAlert={customAlert}
          setRefreshFonts={setRefreshFonts}
          refreshFonts={refreshFonts}
          postUserFonts={(userFontsRequestsDto: UserFontRequestDto[]) => postUserFonts(userFontsRequestsDto)}
        />
        <EditorLeftSideBar 
          optionsItems={[
            {
              icon: <HelpIcon />,
              text: 'Help Me!',
              onClick: () => setShowInstructionSlideshow(true),
              className: 'help-btn'
            },
            {
              icon: <FontsIcon />,
              text: 'Add Font',
              onClick: () => setShowUserFontsClient(true),
              className: 'fonts-btn'
            }
          ]}
        />
        <TemplateRenderer
          designer={designer}
          designerRef={designerRef}
          templates={templates}
          setRightSideBarPage={setRightSideBarPage}
          currentTemplate={currentTemplate}
          SetPdfSizeHandler={SetPdfSizeHandler}
          firstRun={firstRun}
          setFirstRun={setFirstRun}
          customAlert={customAlert}
          fieldsChanged={fieldsChanged}
        />
        <EditorRightSidebar 
          activePage={rightSideBarPage}
          setActivePage={setRightSideBarPage}
          pages={[
            {
              pageTitle: 'Browse',
              handler: () => {
                saveFieldsHandler();
              },
              sections: [
                {
                  sectionTitle: 'Templates',
                  component: (
                    <SelectOptions
                      containerClassOverride="overview-page__select-container"
                      selectClassOverride="overview-page__select-box"
                      options={templateData.map((template, index) => ({
                        value: index.toString(),
                        label: template.templateName,
                      }))}
                      value={getTemplateIndex(currentTemplate).toString()}
                      onChange={(event) => templateChangeHandler(Number(event.target.value))}
                    />
                  ),
                },
                {
                  sectionTitle: 'Add Template',
                  component: <AddButton onClick={confirmAddNewTemplateHandler} />,
                },
                {
                  sectionTitle: 'Add PDF Background',
                  component: (
                    <PdfFileUpload
                      returnPdf={(base64Pdf: string) => pdfFileUploadHandler(base64Pdf)}
                      reset={resetFileUpload}
                      setReset={setResetFileUpload}
                      setFileAdded={setFileAdded}
                    />
                  ),
                },
                {
                  sectionTitle: 'Layout',
                  component: (
                    <SaveButton
                      textfield="Save Template"
                      saveButtonType={'normal'}
                      onClick={confirmChangeTemplateHandler}
                    />
                  ),
                },
              ],
            },
            {
              pageTitle: 'Edit',
              handler: () => {},
              sections: [
                {
                  sectionTitle: 'Layout',
                  component: (
                    <EditSection
                      positionX={templateStyle.positionX}
                      positionY={templateStyle.positionY}
                      sizeWidth={templateStyle.sizeWidth}
                      sizeHeight={templateStyle.sizeHeight}
                      setPositionX={(value: number) => setPositionXHandler(value, designer, selectedField, setTemplateStyle, setFieldsChanged)}
                      setPositionY={(value: number) => setPositionYHandler(value, designer, selectedField, setTemplateStyle, setFieldsChanged)}
                      setSizeWidth={(value: number) => setSizeWidthHandler(value, designer, selectedField, setTemplateStyle, setFieldsChanged)}
                      setSizeHeight={(value: number) => setSizeHeightHandler(value, designer, selectedField, setTemplateStyle, setFieldsChanged)}
                      setAlignHorizontalCenter={() => setAlignHorizontalCenter(designer, selectedField, pdfSize, setTemplateStyle, setFieldsChanged)}
                      setAlignVerticalCenter={() => setAlignVerticalCenter(designer, selectedField, pdfSize, setTemplateStyle, setFieldsChanged)}
                      fieldWidth={fieldWidth}
                      fieldHeight={fieldHeight}
                    />
                  ),
                },
                {
                  sectionTitle: 'Text',
                  component: (
                    <TextEditSection
                      align={templateStyle.align}
                      setAlign={(value: string) => textAlignHandler(value, designer, selectedField, setTemplateStyle, setFieldsChanged)}
                      fontSize={templateStyle.fontSize}
                      setFontSize={(value: number) => fontSizeHandler(value, designer, selectedField, setTemplateStyle, setFieldsChanged)}
                      font={templateStyle.font}
                      setFont={(value: string) => setFontHandler(value, designer, selectedField, setTemplateStyle, setFieldsChanged)}
                      fontColor={templateStyle.fontColor}
                      setFontColor={(value: string) => setFontColorHandler(value, designer, selectedField, setTemplateStyle, setFieldsChanged)}
                      refreshFonts={refreshFonts}
                    />
                  ),
                },
                {
                  sectionTitle: 'Edit Field',
                  component: (
                    <SaveButton
                      textfield="Save Inputs"
                      saveButtonType={'normal'}
                      onClick={saveFieldsHandler}
                      customIcon={<TextInputIcon />}
                    />
                  ),
                },
                {
                  sectionTitle: '',
                  component: (
                    <SaveButton
                      textfield="Remove Template"
                      saveButtonType={'remove'}
                      onClick={confirmRemoveTemplateHandler}
                    />
                  ),
                },
              ],
            },
          ]}
        />
    </main>
  );
};