import { useEffect, useState } from "react";
import { PublishButton } from "../components/MenuItems/Buttons/PublishButton";
import { SelectOptions } from "../components/MenuItems/Inputs/SelectOptions";
import { BootcampResponse } from "../util/types";
import './TemplateCreatorPage.css'
import { Template } from "@pdfme/common";
import { PdfFileUpload } from "../components/MenuItems/Inputs/PdfFileUpload";

type Props = {
    bootcamps: BootcampResponse[] | null;
}

export const TemplateCreatorPage = ({ bootcamps }: Props) => {
    const [templates, setTemplates] = useState<Template[]>();

    useEffect(() => {

    }, [])

    const handleBootcampChange = () => {

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
                                { value: "", label: "All Bootcamps" },
                                ...(bootcamps?.map(bootcamp => ({
                                    value: bootcamp.guidId,
                                    label: bootcamp.name
                                })) || [])
                            ]}
                            onChange={handleBootcampChange}
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