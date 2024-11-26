import { ArrowRight01Icon } from "hugeicons-react";
import { AddStudentRow } from "./AddStudentRow";
import { GraduationDateInput } from "./GraduationDateInput";
import { HeaderRow } from "./HeaderRow";
import { StudentRows } from "./StudentRows";
import { TrackInput } from "./TrackInput";
import { useCache } from "@/hooks";
import { BootcampTypes, BootcampService } from "@/services";
import { UseFormReturn, UseFieldArrayReturn, useForm, useFieldArray } from "react-hook-form";
import { bootcampKey } from "../cacheKeys";

export function DiplomaForm() {
    const [bootcamp, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);

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
    });

    if (!form || !fieldArray)
        return;

    return (
        <form
            id={import.meta.env.VITE_DIPLOMA_FORM_ID}
            onSubmit={onFormSubmit}
        >

            <div className="divider">
                Bootcamp
            </div>

            <div className="flex flex-row">
                <TrackInput form={form} fieldArray={fieldArray} />
                <GraduationDateInput form={form} fieldArray={fieldArray} />
            </div>

            <div className="divider">
                Students</div>

            <div className="overflow-x-auto h-96">
                <table className="table table-xs table-pin-rows table-pin-cols">

                    <thead>
                        <HeaderRow headerTitles={["Name", "Email", ""]} />
                    </thead>

                    <tbody>
                        <AddStudentRow form={form} fieldArray={fieldArray} />
                        <StudentRows form={form} fieldArray={fieldArray} />
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

    );
}







