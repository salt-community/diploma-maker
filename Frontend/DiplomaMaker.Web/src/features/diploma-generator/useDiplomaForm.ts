import { useCache } from "@/hooks";
import { BootcampService, BootcampTypes } from "@/services";
import { useFieldArray, UseFieldArrayReturn, useForm, UseFormReturn } from "react-hook-form";
import { bootcampKey } from "./cacheKeys";

export function useDiplomaForm() {
    const [bootcamp, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);

    const [form, setForm] = useCache<
        UseFormReturn<BootcampTypes.FormBootcamp, any, undefined>
    >(["form"]);

    const [fieldArray, setFieldArray] = useCache<
        UseFieldArrayReturn<BootcampTypes.FormBootcamp, "students", "id">
    >(["fieldArray"]);

    if (bootcamp == null)
        setBootcamp(BootcampService.defaultBootcamp);

    const formBootcamp = bootcamp
        ? BootcampService.bootcampToFormBootcamp(bootcamp)
        : BootcampService.defaultFormBootcamp;

    const formReturn = useForm<BootcampTypes.FormBootcamp>({ values: formBootcamp });

    const fieldArrayReturn = useFieldArray<BootcampTypes.FormBootcamp>({
        control: formReturn.control,
        name: 'students',
    })

    if (form == null)
        setForm(formReturn);

    if (fieldArray == null)
        setFieldArray(fieldArrayReturn);

    const onFormSubmit = formReturn.handleSubmit((bootcamp: BootcampTypes.FormBootcamp) => {
        const updatedBootcamp = BootcampService.formBootcampToBootcamp(bootcamp);
        setBootcamp(updatedBootcamp);
    });

    return {
        form,
        fieldArray,
        onFormSubmit
    }
}