import { BootcampTypes } from "@/services";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

export interface DiplomaFormProps {
    form: UseFormReturn<BootcampTypes.FormBootcamp, any, undefined>,
    fieldArray: UseFieldArrayReturn<BootcampTypes.FormBootcamp, "students", "id">
}