import { useEffect, useState } from "react";
import { PublishButton } from "../components/MenuItems/Buttons/PublishButton";
import { SelectOptions } from "../components/MenuItems/Inputs/SelectOptions";
import { BootcampResponse } from "../util/types";
import './TemplateCreatorPage.css'
import { Template } from "@pdfme/common";

type Props = {
    bootcamps: BootcampResponse[] | null;
}

export const TemplateCreatorPage = ({ bootcamps }: Props) => {
    const [templates, setTemplates] = useState<Template[]>();

    useEffect(() => {

    }, [])

    const handleBootcampChange = () => {

    }
    const generatePDFsHandler = () => {

    }
    return(
        <main className="templatecreator-page">
            <section className='templatecreator-page__leftsidebar'>
                <div className='templatecreator-page__leftsidebar-menu'>
                    <header className="templatecreator-page__leftsidebar-menu-header">
                        <button>
                            Browse
                        </button>
                    </header>
                    <section className="templatecreator-page__leftsidebar-menu-section">
                        <h3>Filtering</h3>               </section>
                    <section className="templatecreator-page__leftsidebar-menu-section">
                        <h3>Bootcamps</h3>
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
                    <section className="templatecreator-page__leftsidebar-menu-section">
                        <h3>Generate</h3>
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
                    </header>
                    <section className="templatecreator-page__rightsidebar-menu-section">
                        <h3>Filtering</h3>               </section>
                    <section className="templatecreator-page__rightsidebar-menu-section">
                        <h3>Bootcamps</h3>
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
                        <h3>Generate</h3>
                        <PublishButton text='Generate PDFs' onClick={generatePDFsHandler} />
                    </section>
                </div>
            </section>
        </main>
    )
}