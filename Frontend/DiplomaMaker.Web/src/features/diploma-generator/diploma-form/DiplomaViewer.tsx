import { PreviewDiplomaViewer } from "@/features/diploma-viewer";
import { useCache } from "@/hooks";
import { BootcampTypes, BackendTypes, TemplateService, DiplomaService } from "@/services";
import { bootcampKey, currentTemplateKey } from "../cacheKeys";

export function DiplomaViewer() {
    const [bootcamp, _] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
    const [currentTemplate, __] = useCache<BackendTypes.Template>(currentTemplateKey);

    if (!currentTemplate || !bootcamp) return;

    return (<PreviewDiplomaViewer
        template={TemplateService.backendTemplateToPdfMeTemplate(currentTemplate)}
        substitions={DiplomaService.createSubstitions({
            graduationDate: bootcamp.graduationDate,
            studentEmail: bootcamp.students[0].email,
            studentName: bootcamp.students[0].name,
            templateGuid: 'n/a',
            track: bootcamp.track,
        } as BackendTypes.DiplomaRecord)} />);
}