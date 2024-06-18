import { SelectOptions } from "../components/MenuItems/Inputs/SelectOptions";
import './TemplateCreatorPage.css'
import { PdfFileUpload } from "../components/MenuItems/Inputs/PdfFileUpload";
import { Template, TemplateResponse } from "../util/types";
import { useEffect, useState } from "react";

type Props = {
    templates: TemplateResponse[] | null;
}

export const TemplateCreatorPage = ({ templates }: Props) => {
    const [templateData, setTemplateData] = useState<Template[]>([]);
    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
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

    const templateChangeHandler = (index: number) => {
        setCurrentTemplate(templateData[index] || null);
    };

    const pdfFileUploadHandler = (file: File) => {
        console.log(file);
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
                <div className='templatecreator-page__preview'>
                    <h2>{currentTemplate?.templateName}</h2>
                    <div className="pdfpreview">

                    </div>
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
                                <h3>Add PDF Background</h3>
                                <PdfFileUpload fileResult={(file: File) => pdfFileUploadHandler(file)} />
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
