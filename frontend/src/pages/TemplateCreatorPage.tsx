import { SelectOptions } from "../components/MenuItems/Inputs/SelectOptions";
import './TemplateCreatorPage.css'
import { PdfFileUpload } from "../components/MenuItems/Inputs/PdfFileUpload";
import { CustomTemplate, TemplateRequest, TemplateResponse } from "../util/types";
import { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import { cloneDeep, getFontsData, getPlugins } from "../util/helper";
import { getTemplate, makeTemplateInput } from "../templates/baseTemplate";
import { Template } from "@pdfme/common";
import { PDFDocument } from 'pdf-lib';
import { SaveButton, SaveButtonType } from "../components/MenuItems/Buttons/SaveButton";
import { AddButton } from "../components/MenuItems/Buttons/AddButton";
import { ConfirmationPopup, ConfirmationPopupType } from "../components/MenuItems/Popups/ConfirmationPopup";
import { AlertPopup, PopupType } from "../components/MenuItems/Popups/AlertPopup";
import { RemoveButton } from "../components/MenuItems/Buttons/RemoveButton";

type Props = {
    templates: TemplateResponse[] | null;
    addNewTemplate: (templateRequest: TemplateRequest) => Promise<void>;
    updateTemplate: (id: number, templateRequest: TemplateRequest) => Promise<TemplateResponse>;
    deleteTemplate: (templateRequest: number) => Promise<void>;
}

export const TemplateCreatorPage = ({ templates, addNewTemplate, updateTemplate, deleteTemplate }: Props) => {
    const [templateData, setTemplateData] = useState<CustomTemplate[]>([]);
    const [currentTemplate, setCurrentTemplate] = useState<CustomTemplate | null>(null);

    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<Designer | null>(null);

    const [rightSideBarPage, setRightSideBarPage] = useState<number>(0);
    const [leftSideBarPage, setLeftSideBarPage] = useState<number>(0);

    const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);
    const [confirmationPopupContent, setConfirmationPopupContent] = useState<string[]>(["",""]);
    const [confirmationPopupType, setConfirmationPopupType] = useState<ConfirmationPopupType>(ConfirmationPopupType.question);
    const [confirmationPopupHandler, setConfirmationPopupHandler] = useState<() => void>(() => {});
    
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupContent, setPopupContent] = useState<string[]>(["",""]);
    const [popupType, setPopupType] = useState<PopupType>(PopupType.success);
    
    const [templateHasChanged, setTemplateHasChanged] = useState<boolean>(false);
    const [fileAdded, setFileAdded] = useState<boolean>(false);

    useEffect(() => {
        if (templates && templates.length > 0) {
            const templateData = templates.map(template => ({
                id: template.id,
                templateName: template.templateName,
                footer: template.footer,
                intro: template.intro,
                studentName: template.studentName,
                basePdf: template.basePdf
            }));
            setTemplateData(templateData);
            setCurrentTemplate(templateData[0] || null);
        }
    }, [templates]);
    
    useEffect(() => {
        if (currentTemplate) {
            const inputs = [makeTemplateInput(
                currentTemplate.intro,
                currentTemplate.studentName,
                currentTemplate.footer,
                currentTemplate.basePdf
            )];
            const template: Template = getTemplate(inputs[0]);

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

    const templateChangeHandler = async (index: number) => {
        if (templateHasChanged) {
            shouldWeSaveHandler(index);
        }
        else{
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
    
                const updatedTemplateData = templateData.map(template =>
                    template.id === currentTemplate.id ? updatedTemplate : template
                );
                setTemplateData(updatedTemplateData);
            }
            setTemplateHasChanged(true);
            setFileAdded(true);
        }
    };

    const saveTemplate = async (goToIndex?: number) => {
        if(currentTemplate){
            setShowConfirmationPopup(false);
            try {
                await updateTemplate(currentTemplate?.id, currentTemplate);
                customAlert(PopupType.success, "Template Successfully Updated!", `Successfully updated ${currentTemplate.templateName} to database`);
                setTemplateHasChanged(false);
                if (goToIndex !== undefined) {
                    setCurrentTemplate(templateData[goToIndex] || null);
                    setFileAdded(false);
                }
            } catch (error) {
                customAlert(PopupType.fail, "Template Update failure!", `${error} when trying to update template.`);
            }
        }
    }

    const addTemplate = async (inputContent?: string) => {
        setShowConfirmationPopup(false);
        if(templateData.some(template => template.templateName === inputContent)){
            customAlert(PopupType.fail, "Template Creation failure!", `Name already exists`);
            return;
        }
        if(inputContent && inputContent.trim() != ""){
            try {
                const blankTemplate: TemplateRequest = {
                    templateName: inputContent,
                    intro: "",
                    studentName: "",
                    footer: "",
                    basePdf: "",
                  }
                await addNewTemplate(blankTemplate);
                customAlert(PopupType.success, "Succesfully added new template!", `Successfully added new template to database.`);
            } catch (error) {
                customAlert(PopupType.fail, "Template add failure!", `${error} when trying to add new template to database.`);
            }
        } else {
            customAlert(PopupType.fail, "Template Creation failure!", `Name field is blank`);
        }
    }

    const removeTemplate = async () => {
        if(currentTemplate?.id){
            setShowConfirmationPopup(false);
            const templateId = currentTemplate?.id;
            if(templateId === 1){
                customAlert(PopupType.fail, `Cannot Delete the Default Template`, `You are not allowed to delete the baseTemplate.`);
                return;
            }
            try {
                await deleteTemplate(templateId);
                customAlert(PopupType.success, "Template Successfully Deleted!", `Successfully deleted ${currentTemplate.templateName} from database`);
                setTemplateHasChanged(false);
            } catch (error) {
                customAlert(PopupType.fail, "Template Update failure!", `${error} when trying to update template.`);
            }
        }
    }

    const shouldWeSaveHandler = async (index: number) => {
        customPopup(ConfirmationPopupType.question, "Do you want to save your changes?", "This will change template for all bootcamps that use this template", () => () => saveTemplate(index));
    }

    const confirmChangeTemplateHandler = async () => {
        customPopup(ConfirmationPopupType.question, "Are you sure you want to save changes to this template?", "This will change template for all bootcamps that use this template", () => saveTemplate)
    }

    const confirmAddNewTemplateHandler = async () => {
        customPopup(ConfirmationPopupType.form, "What should we name your template?", "Names are echoes of identity, whispers of our soul's melody.", () => (inputContent?: string) => addTemplate(inputContent))
    }

    const confirmRemoveTemplateHandler = async () => {
        customPopup(ConfirmationPopupType.warning, `Are you sure you want to remove ${currentTemplate?.templateName}?`, "This will unlink the template for all bootcamps that use it.", () => () => removeTemplate())
    }

    const globalAbortHandler = () => {
        setShowConfirmationPopup(false);
    }

    const customAlert = (alertType: PopupType, title: string, content: string) => {
        setPopupType(alertType);
        setPopupContent([title, content]);
        setShowPopup(true);
    }

    const customPopup = (type: ConfirmationPopupType, title: string, content: string, handler: () => ((inputContent?: string) => void) | (() => void)) => {
        setConfirmationPopupType(type);
        setConfirmationPopupContent([title, content]);
        setConfirmationPopupHandler(handler);
        setShowConfirmationPopup(true);
    }

    return (
        <main className="templatecreator-page">
            <ConfirmationPopup 
                title={confirmationPopupContent[0]}
                text={confirmationPopupContent[1]}
                show={showConfirmationPopup}
                confirmationPopupType={confirmationPopupType}
                abortClick={() => globalAbortHandler()}
                confirmClick={(inputContent?: string) => confirmationPopupHandler(inputContent)}
            />
            <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={() => setShowPopup(false)}/>
            <section className='templatecreator-page__leftsidebar'>
                <div className='templatecreator-page__leftsidebar-menu'>
                    <header className="templatecreator-page__leftsidebar-menu-header">
                        <button onClick={() => setLeftSideBarPage(0)} className={leftSideBarPage === 0 ? 'active' : ''}>
                            -
                        </button>
                        <button onClick={() => setLeftSideBarPage(1)} className={leftSideBarPage === 1 ? 'active' : ''}>
                            -
                        </button>
                    </header>
                    {leftSideBarPage === 0 && 
                        <>
                            <section className="templatecreator-page__leftsidebar-menu-section">
                                <h3>page 1</h3>
                            </section>
                        </>
                    }
                    {leftSideBarPage === 1 && 
                        <>
                            <section className="templatecreator-page__leftsidebar-menu-section">
                                <h3>page 2</h3>
                            </section>
                        </>
                    }
                    
                </div>
            </section>
            <section className='templatecreator-page__preview-container'>
                <div className='templatecreator-page__preview' style={{width: '100%', overflow: 'hidden', height: `calc(50vh - 68px)` }}>
                    <h2>{currentTemplate?.templateName}</h2>
                    <div className="pdfpreview" ref={designerRef} style={{height: `80%` }}/>
                </div>
            </section>
            <section className='templatecreator-page__rightsidebar'>
                <div className='templatecreator-page__rightsidebar-menu'>
                    <header className="templatecreator-page__rightsidebar-menu-header">
                        <button onClick={() => setRightSideBarPage(0)} className={rightSideBarPage === 0 ? 'active' : ''}>
                            Browse
                        </button>
                        <button onClick={() => setRightSideBarPage(1)} className={rightSideBarPage === 1 ? 'active' : ''}>
                            Edit
                        </button>
                    </header>
                    {rightSideBarPage === 0 && 
                        <>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <h3>Templates</h3>
                                <SelectOptions
                                    containerClassOverride='overview-page__select-container'
                                    selectClassOverride='overview-page__select-box'
                                    options={templateData.map((template, index) => ({
                                        value: index.toString(),
                                        label: template.templateName
                                    }))}
                                    onChange={(event) => templateChangeHandler(Number(event.target.value))}
                                />
                            </section>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <h3>Add Template</h3>
                                <AddButton onClick={confirmAddNewTemplateHandler}/>
                            </section>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <h3>Add PDF Background</h3>
                                <PdfFileUpload fileResult={(file: File) => pdfFileUploadHandler(file)} fileAdded={fileAdded} setFileAdded={setFileAdded} />
                            </section>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <SaveButton saveButtonType={SaveButtonType.normal} onClick={confirmChangeTemplateHandler}/>
                            </section>
                        </>
                    }
                    {rightSideBarPage === 1 && 
                        <>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <h3>Editing Stuff</h3>
                            </section>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <h3>Edit Fields</h3>
                            </section>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <SaveButton saveButtonType={SaveButtonType.remove} onClick={confirmRemoveTemplateHandler}/>
                            </section>
                        </>
                    }
                </div>
            </section>
        </main>
    )
}
