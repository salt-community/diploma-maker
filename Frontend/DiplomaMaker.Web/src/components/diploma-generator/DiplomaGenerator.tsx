import { DiplomaService, TemplateService } from "@/services";
import type { BootcampTypes, BackendTypes } from "@/services";
import { useCache } from "@/hooks";

import { bootcampKey, currentTemplateKey } from "./cacheKeys";
import UploadBootcamp from "./UploadBootcamp";
import TemplatePicker from "./TemplatePicker";
import BootcampForm from "./BootcampForm";
import DiplomaViewer from "../diploma-viewer/DiplomaViewer";

const sendOutEmailsOnSubmit = false;

export default function DiplomaGenerator() {
    const [bootcamp, _] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
    const [currentTemplate, __] = useCache<BackendTypes.Template>(currentTemplateKey);

    const emailPdfs = async () => {
        if (!bootcamp) throw new Error("No bootcamp");
        if (!currentTemplate) throw new Error("No template is selected");

        const promises = bootcamp.students.map(async (student) => {
            await DiplomaService.emailDiploma(
                TemplateService.backendTemplateToPdfMeTemplate(currentTemplate),
                bootcamp,
                student);
        });

        await Promise.all(promises);
    }

    return (
        <div className="flex h-full flex-col">
            <div className="navbar z-40 bg-neutral">
                <div className="navbar-start">
                    <TemplatePicker />
                </div>

                <div className="navbar-end">
                    <UploadBootcamp />
                </div>
            </div>

            <BootcampForm />

            {(currentTemplate && bootcamp != null) &&
                <DiplomaViewer
                    template={TemplateService.backendTemplateToPdfMeTemplate(currentTemplate)}
                    substitions={DiplomaService.createSubstitions(bootcamp, bootcamp.students[0])} />}
        </div>
    );
}
