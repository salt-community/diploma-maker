import { BootcampService } from "@/services";
import { UserAdd01Icon } from "hugeicons-react";
import { DiplomaFormProps } from "./DiplomaFormProps";

export function AddStudentRow({ fieldArray }: DiplomaFormProps) {
    if (fieldArray == null) return;

    return (
        <tr key={"addStudent"}>
            <td colSpan={3}>
                <div className="flex justify-center items-center">
                    <button
                        className="btn  w-full"
                        onClick={() => {
                            fieldArray.prepend(BootcampService.defaultStudent)
                        }}>
                        <UserAdd01Icon size={16} />Add Student
                    </button>
                </div>
            </td>
        </tr>
    );
}