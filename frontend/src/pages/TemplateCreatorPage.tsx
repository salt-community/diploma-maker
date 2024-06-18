import { SelectOptions } from "../components/MenuItems/Inputs/SelectOptions";
import './TemplateCreatorPage.css'
import { PdfFileUpload } from "../components/MenuItems/Inputs/PdfFileUpload";
import { Template, TemplateResponse } from "../util/types";
import { useEffect, useState } from "react";

type Props = {
    templates: TemplateResponse[] | null;
}

export const TemplateCreatorPage = ({ templates }: Props) => {
    const [currentTemplate, setCurrentTemplate] = useState<Template>();

    useEffect(() => {
        if(templates){
            setCurrentTemplate(templates[0])
        }
    }, [templates])

    const handleTemplateChange = () => {
        
    }

    const pdfFileUploadHandler = (file: File) => {
        console.log(file);
    }
    
    return(
        <main className="templatecreator-page">
            <section className='templatecreator-page__leftsidebar'>
                <div className='templatecreator-page__leftsidebar-menu'>
                    <header className="templatecreator-page__leftsidebar-menu-header">
                        
                    </header>
                    <section className="templatecreator-page__leftsidebar-menu-section">

                    </section>
                </div>
            </section>
            <section className='templatecreator-page__preview-container'>
                <div className='templatecreator-page__preview'>
                    <h2>Slide 1</h2>
                    <div className="pdfpreview">
                        
                    </div>
                </div>
            </section>
            <section className='templatecreator-page__rightsidebar'>
                <div className='templatecreator-page__rightsidebar-menu'>
                    <header className="templatecreator-page__rightsidebar-menu-header">
                        <button>
                            Browse
                        </button>
                        <button>
                            Edit
                        </button>
                    </header>
                    <section className="templatecreator-page__rightsidebar-menu-section">
                        <h3>Templates</h3>
                        <SelectOptions
                            containerClassOverride='overview-page__select-container'
                            selectClassOverride='overview-page__select-box'
                            options={[
                                ...(templates?.map(template => ({
                                    value: template.templateName,
                                    label: template.templateName
                                })) || [])
                            ]}
                            onChange={handleTemplateChange}
                        />
                    </section>
                    <section className="templatecreator-page__rightsidebar-menu-section">
                        <h3>Add PDF Background</h3>
                        <PdfFileUpload fileResult={(file: File) => pdfFileUploadHandler(file)}/>
                    </section>
                </div>
            </section>
        </main>
    )
}