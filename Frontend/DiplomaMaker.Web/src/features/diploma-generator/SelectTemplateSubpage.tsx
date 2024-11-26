import { useCache } from "@/hooks";
import { BootcampTypes, BackendTypes, TemplateService, DiplomaService } from "@/services";
import { PreviewDiplomaViewer } from "../diploma-viewer";
import { bootcampKey, currentTemplateKey } from "./cacheKeys";
import TemplatePicker from "./TemplatePicker";

interface Props {
    display: boolean
}

export default function SelectTemplateSubpage({ display }: Props) {
    const [bootcamp, _] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
    const [currentTemplate, __] = useCache<BackendTypes.Template>(currentTemplateKey);

    if (display == false) return;

    return (
        <>
            <div className="flex flex-row justify-between">
                <TemplatePicker />

                <button
                    type="submit"
                    form={import.meta.env.VITE_DIPLOMA_FORM_ID}
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus">
                    Send Out Diplomas
                </button>
            </div >


            {(currentTemplate && bootcamp != null) &&
                <PreviewDiplomaViewer
                    template={TemplateService.backendTemplateToPdfMeTemplate(currentTemplate)}
                    substitions={DiplomaService.createSubstitions({
                        graduationDate: bootcamp.graduationDate,
                        studentEmail: bootcamp.students[0].email,
                        studentName: bootcamp.students[0].name,
                        templateGuid: 'n/a',
                        track: bootcamp.track,
                    } as BackendTypes.DiplomaRecord)}
                    className="h-full" />
            }
        </>
    );
}