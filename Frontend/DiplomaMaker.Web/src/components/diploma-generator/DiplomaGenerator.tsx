import { NamedEntity } from "@/services/backendService/models";
import { useTemplates } from "@/hooks/useTemplates";
import useCache from "@/hooks/useCache";
import TemplatePicker from "./TemplatePicker";
import { selectedTemplateDiplomaKey } from "./cacheKeys";
import { DropJson } from "./DropJson";
import { usePdfMeViewer } from "@/hooks/usePdfMeViewer";
import { useRef } from "react";
import { Bootcamp } from "@/services/fileService";
import BootcampForm from "./BootcampForm";

export default function DiplomaGenerator() {
    const viewerContainerRef = useRef<HTMLDivElement | null>(null);
    const templateHook = useTemplates();
    const [bootcamp, setBootcamp] = useCache<Bootcamp>(["Bootcamp"]);

    const [selectedTemplate, _] = useCache<NamedEntity>(selectedTemplateDiplomaKey);
    const {
        loadViewer,
    } = usePdfMeViewer(viewerContainerRef);

    if (selectedTemplate?.guid && bootcamp) {
        const templateWithContent = templateHook.templateByGuid(selectedTemplate?.guid);
        if (templateWithContent) {
            loadViewer(templateWithContent, {
                graduationDate: bootcamp.graduationDate.toDateString(),
                studentName: bootcamp.students[0].name,
                qrLink: "www.google.com",
                track: bootcamp.track
            });
        }
    }

    return (
        <div className="flex h-full flex-col">
            <div className="navbar z-40 bg-neutral">
                <div className="navbar-start">
                    <TemplatePicker
                        onTemplateSelect={() => console.log("Selected template")}
                    />
                </div>

                <div className="navbar-end">
                    <DropJson onDrop={(bootcamp) => setBootcamp(bootcamp)} />
                </div>
            </div>
            <BootcampForm />
            <div ref={viewerContainerRef} />
        </div>
    );
}
