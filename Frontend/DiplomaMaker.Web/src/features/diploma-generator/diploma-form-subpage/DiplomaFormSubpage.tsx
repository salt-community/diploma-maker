import { AddStudentRow } from "./AddStudentRow";
import { GraduationDateInput } from "./GraduationDateInput";
import { HeaderRow } from "./HeaderRow";
import { StudentRows } from "./StudentRows";
import { TrackInput } from "./TrackInput";
import { useCache, useToken } from "@/hooks";
import { BootcampTypes, BootcampService, BackendTypes, DiplomaService, TemplateService } from "@/services";
import { useForm, useFieldArray } from "react-hook-form";
import { bootcampKey, currentTemplateKey, selectedTemplateKey } from "../cacheKeys";
import UploadBootcamp from "../UploadBootcamp";

interface Props {
    display: boolean
}

export function DiplomaFormSubpage({ display }: Props) {
    const [bootcamp, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
    const [currentTemplate, __] = useCache<BackendTypes.Template>(currentTemplateKey);
    const { token } = useToken();

    if (bootcamp == null)
        setBootcamp(BootcampService.defaultBootcamp);

    const formBootcamp = bootcamp
        ? BootcampService.bootcampToFormBootcamp(bootcamp)
        : BootcampService.defaultFormBootcamp;

    const form = useForm<BootcampTypes.FormBootcamp>({ values: formBootcamp });

    const fieldArray = useFieldArray<BootcampTypes.FormBootcamp>({
        control: form.control,
        name: 'students',
    })

    const onFormSubmit = form.handleSubmit((bootcamp: BootcampTypes.FormBootcamp) => {
        const updatedBootcamp = BootcampService.formBootcampToBootcamp(bootcamp);
        setBootcamp(updatedBootcamp);

        if (!currentTemplate)
            throw new Error("No template");

        if (!token || token == null)
            throw new Error("No token");

        updatedBootcamp.students.map(async (student) => {
            const diploma = await DiplomaService.postDiploma(currentTemplate, updatedBootcamp, student);

            if (import.meta.env.VITE_SEND_DIPLOMAS == 0) return;

            await DiplomaService.emailDiploma(
                TemplateService.backendTemplateToPdfMeTemplate(currentTemplate),
                diploma,
                token);
        });
    });

    if (!form || !fieldArray)
        return;

    return (
        <form
            className="h-full"
            id={import.meta.env.VITE_DIPLOMA_FORM_ID}
            onSubmit={onFormSubmit}
            hidden={!display}>

            <div className="divider">
                Select a bootcamp .json file to auto-fill the form
            </div>

            <div className="flex flex-row justify-center" >
                <UploadBootcamp />
            </div>

            <div className="divider">
                Bootcamp
            </div>

            <div className="flex flex-row justify-between">
                <TrackInput form={form} fieldArray={fieldArray} />
                <GraduationDateInput form={form} fieldArray={fieldArray} />
            </div>

            <div className="divider">
                Students
            </div>

            <div className="overflow-x-auto">
                <table className="table table-xs table-pin-rows table-pin-cols">

                    <thead>
                        <HeaderRow headerTitles={["Name", "Email", ""]} />

                    </thead>

                    <tbody>
                        <AddStudentRow form={form} fieldArray={fieldArray} />
                        <StudentRows form={form} fieldArray={fieldArray} />
                    </tbody>

                </table>
            </div>
        </form >

    );
}







