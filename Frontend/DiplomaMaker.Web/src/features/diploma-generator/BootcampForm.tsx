import { useFieldArray, useForm } from "react-hook-form";
import { Add01Icon, UserAdd01Icon, ArrowRight01Icon, Delete04Icon } from "hugeicons-react";

import { BootcampService, DiplomaService, TemplateService } from "@/services";
import type { BackendTypes, BootcampTypes } from "@/services";
import { useCache, useModal, useToken } from "@/hooks";

import { bootcampKey, currentTemplateKey, selectedTemplateKey } from "./cacheKeys";
import PreviewDiplomaViewer from "../diploma-viewer/PreviewDiplomaViewer";
import { Modal } from "@/components";
import UploadBootcamp from "./UploadBootcamp";

interface Props {
    display?: boolean
}

export default function BootcampForm({ display }: Props) {
    const [bootcamp, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);
    const [selectedTemplate, _] = useCache<BackendTypes.NamedEntity>(selectedTemplateKey);
    const [currentTemplate, __] = useCache<BackendTypes.Template>(currentTemplateKey);
    const { token } = useToken();
    const { open: openPreviewDiplomaViewerModal } = useModal(import.meta.env.VITE_PREVIEW_DIPLOMA_VIEWER_MODAL_ID);

    if (bootcamp == null)
        setBootcamp(BootcampService.defaultBootcamp);

    const formBootcamp = bootcamp
        ? BootcampService.bootcampToFormBootcamp(bootcamp)
        : BootcampService.defaultFormBootcamp;

    if (!formBootcamp)
        throw new Error("formBootcamp could not be initialized");

    const { register, control, handleSubmit } = useForm<BootcampTypes.FormBootcamp>({
        values: formBootcamp
    });

    const { fields: studentFields, prepend, remove } = useFieldArray<BootcampTypes.FormBootcamp>({
        control,
        name: 'students',
    });

    const onFormSubmit = (bootcamp: BootcampTypes.FormBootcamp) => {
        const updatedBootcamp = BootcampService.formBootcampToBootcamp(bootcamp);
        setBootcamp(updatedBootcamp);
    };

    const header = (<tr>
        <th>Name</th><th>Email</th><th></th>
    </tr>);

    const addUserRow = (<tr key={"addStudent"}>
        <td colSpan={3}>
            <div className="flex justify-center items-center">
                <button
                    className="btn  w-full"
                    onClick={() => prepend(BootcampService.defaultStudent)}>
                    <UserAdd01Icon size={16} />Add Student
                </button>
            </div>
        </td>
    </tr>)

    const rows = studentFields.map((student, index) => (
        <tr key={student.id}>
            <td>
                <input
                    {...register(`students.${index}.name`, { required: true, minLength: 3 })}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                />
            </td>

            <td>
                <input
                    {...register(`students.${index}.email`, { required: true, minLength: 3 })}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                />
            </td>

            <td>
                <button
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    onClick={() => {
                        remove(index);
                    }}
                    disabled={studentFields.length <= 1}>
                    <Delete04Icon size={16} />
                </button>
            </td>
        </tr>
    ));

    rows.unshift(addUserRow);

    if (display == false)
        return;

    return (
        <div className="overflow-x-auto p-4 max-w-screen-lg">
            <div className="divider">Pick a bootcamp .json file to auto-populate the form</div>
            <UploadBootcamp />

            <form
                id={import.meta.env.VITE_DIPLOMA_FORM_ID}
                onSubmit={handleSubmit(onFormSubmit)}
            >

                <div className="divider">Bootcamp</div>

                <div className="flex flex-row">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Track</span>
                        </div>
                        <input {...register('track')}
                            className="input input-bordered w-full max-w-xs"
                            type="text"
                        />
                    </label>


                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Graduation Date</span>
                        </div>
                        <input {...register('graduationDate')}
                            className="input input-bordered w-full max-w-xs"
                            type="date"
                        />
                    </label>
                </div>

                <div className="divider">Students</div>

                <div className="overflow-x-auto h-96">
                    <table className="table table-xs table-pin-rows table-pin-cols">

                        <thead>
                            {header}
                        </thead>

                        <tbody>
                            {rows}
                        </tbody>

                    </table>

                    <div className="flex flex-row justify-end">
                        <button
                            type="submit"
                            className="btn bg-primary text-primary-content hocus:bg-primary-focus mx-"
                        >
                            Select Template
                            <ArrowRight01Icon size={16} />
                        </button>
                    </div>
                </div>
            </form>

            <button
                className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                disabled={selectedTemplate == null}
                onClick={openPreviewDiplomaViewerModal}
            >
                <Add01Icon size={16} />
                Preview Diploma
            </button>

            <Modal id={import.meta.env.VITE_PREVIEW_DIPLOMA_VIEWER_MODAL_ID} title="Preview Diploma">
                {(currentTemplate && bootcamp != null) &&
                    <PreviewDiplomaViewer
                        template={TemplateService.backendTemplateToPdfMeTemplate(currentTemplate)}
                        substitions={DiplomaService.createSubstitions({
                            graduationDate: bootcamp.graduationDate,
                            studentEmail: bootcamp.students[0].email,
                            studentName: bootcamp.students[0].name,
                            templateGuid: 'n/a',
                            track: bootcamp.track,
                        } as BackendTypes.DiplomaRecord)} />}
            </Modal>
        </div >
    );
}