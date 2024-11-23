import { DiplomaService, TemplateService } from "@/services";
import type { BootcampTypes, BackendTypes } from "@/services";
import { useCache } from "@/hooks";

import { bootcampKey, currentTemplateKey } from "./cacheKeys";
import UploadBootcamp from "./UploadBootcamp";
import TemplatePicker from "./TemplatePicker";
import BootcampForm from "./BootcampForm";
import PreviewDiplomaViewer from "../diploma-viewer/PreviewDiplomaViewer";

export default function DiplomaGenerator() {
    const [bootcamp, _] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
    const [currentTemplate, __] = useCache<BackendTypes.Template>(currentTemplateKey);

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
                <PreviewDiplomaViewer
                    template={TemplateService.backendTemplateToPdfMeTemplate(currentTemplate)}
                    substitions={DiplomaService.createSubstitions(bootcamp, bootcamp.students[0])} />}
        </div>
    );
}
