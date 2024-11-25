import { useFieldArray, useForm } from "react-hook-form";
import { Add01Icon, Delete04Icon } from "hugeicons-react";

import { BootcampService, DiplomaService, TemplateService } from "@/services";
import type { BackendTypes, BootcampTypes } from "@/services";
import { useCache, useModal, useToken } from "@/hooks";
import { Modal } from "@/components";

import { bootcampKey, currentTemplateKey, selectedTemplateKey } from "./cacheKeys";
import PreviewDiplomaViewer from "../diploma-viewer/PreviewDiplomaViewer";

export default function BootcampForm() {
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

    const { fields: studentFields, append, remove } = useFieldArray<BootcampTypes.FormBootcamp>({
        control,
        name: 'students',
    });

    const onFormSubmit = (bootcamp: BootcampTypes.FormBootcamp) => {
        const updatedBootcamp = BootcampService.formBootcampToBootcamp(bootcamp);
        setBootcamp(updatedBootcamp);

        if (!currentTemplate)
            throw new Error("No template");

        updatedBootcamp.students.map(async (student) => {
            const diploma = await DiplomaService.postDiploma(currentTemplate, updatedBootcamp, student);
            if (!token) return;

            await DiplomaService.emailDiploma(
                TemplateService.backendTemplateToPdfMeTemplate(currentTemplate),
                diploma,
                token);
        });
    };

    const header = (<tr>
        <th>Name</th><th>Email</th><th></th>
    </tr>);

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
                    Remove
                </button>
            </td>
        </tr>
    ));

    return (
        <div className="overflow-x-auto p-4 max-w-screen-lg">
            <form onSubmit={handleSubmit(onFormSubmit)}>
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

                <span className="label-text">Students</span>

                <table className="table my-4">

                    <thead>
                        {header}
                    </thead>

                    <tbody>
                        {rows}
                    </tbody>

                </table>

                <button
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    onClick={() => append(BootcampService.defaultStudent)}>
                    <Add01Icon size={16} />
                    Add Student
                </button>

                <button
                    type="submit"
                    className="btn bg-primary text-primary-content hocus:bg-primary-focus"
                    disabled={selectedTemplate == null}>
                    <Add01Icon size={16} />
                    Send Out Diplomas
                </button>
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