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
import { getTemplateSample } from "../templates/sampledata";
import { AddButton } from "../components/MenuItems/Buttons/AddButton";

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
        // const template: Template = getTemplateSample();

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

    const templateChangeHandler = (index: number) => {
        setCurrentTemplate(templateData[index] || null);
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
        }
    };

    return (
        <main className="templatecreator-page">
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
                                    options={[
                                        ...(templateData.map(template => ({
                                            value: template.templateName,
                                            label: template.templateName
                                        })))
                                    ]}
                                    onChange={(event) => templateChangeHandler(Number(event.target.value))}
                                />
                            </section>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <h3>Add Template</h3>
                                <AddButton onClick={() => {}}/>
                            </section>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <h3>Add PDF Background</h3>
                                <PdfFileUpload fileResult={(file: File) => pdfFileUploadHandler(file)} />
                            </section>
                            <section className="templatecreator-page__rightsidebar-menu-section">
                                <SaveButton saveButtonType={SaveButtonType.normal} onClick={() => {}}/>
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
                        </>
                    }
                </div>
            </section>
        </main>
    )
}
