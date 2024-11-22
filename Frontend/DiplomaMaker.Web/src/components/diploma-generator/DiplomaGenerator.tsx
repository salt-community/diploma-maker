import { useRef } from "react";

import { StringService, BackendService } from "@/services";
import type { FileTypes, BackendTypes } from "@/services";
import { useTemplates, useCache, usePdfMeViewer } from "@/hooks";

import { selectedTemplateDiplomaKey } from "./cacheKeys";
import UploadJson from "./UploadJson";
import TemplatePicker from "./TemplatePicker";
import BootcampForm from "./BootcampForm";

const sendOutEmailsOnSubmit = false;

export default function DiplomaGenerator() {
    const viewerContainerRef = useRef<HTMLDivElement | null>(null);
    const templateHook = useTemplates();
    const [bootcamp, setBootcamp] = useCache<FileTypes.Bootcamp>(["Bootcamp"]);
    const [selectedTemplate, _] = useCache<BackendTypes.NamedEntity>(selectedTemplateDiplomaKey);

    const {
        loadViewer,
        generatePdf
    } = usePdfMeViewer(viewerContainerRef);

    if (selectedTemplate?.guid && bootcamp) {
        const templateWithContent = templateHook.templateByGuid(selectedTemplate?.guid);
        console.log(bootcamp);
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
                    <UploadJson onDrop={(bootcamp) => setBootcamp(bootcamp)} />
                </div>
            </div>

            <BootcampForm onSubmit={async () => {
                if (!bootcamp)
                    throw new Error("No bootcamp");

                const blob = await generatePdf({
                    studentName: bootcamp?.students[0].name!,
                    track: bootcamp!.track,
                    graduationDate: bootcamp!.graduationDate!.toISOString().split("T")[0],
                    qrLink: "www.google.com"
                });

                const blobString = StringService.base64StringWithoutMetaData(
                    await StringService.blobToBase64String(blob)
                );

                if (!sendOutEmailsOnSubmit)
                    return;

                BackendService.sendDiplomaEmail({
                    track: bootcamp.track,
                    diplomaPdfBase64: blobString,
                    studenEmail: bootcamp.students[0].email,
                    studentName: bootcamp.students[0].name
                });
            }} />
            <div ref={viewerContainerRef} />
        </div>
    );
}
