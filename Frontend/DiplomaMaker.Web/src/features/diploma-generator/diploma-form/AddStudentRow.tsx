import { BootcampService, BootcampTypes } from "@/services";
import { UserAdd01Icon } from "hugeicons-react";
import { useCache } from "@/hooks";
import { bootcampKey } from "../cacheKeys";
import { DiplomaFormProps } from "./DiplomaFormProps";

export function AddStudentRow({ fieldArray }: DiplomaFormProps) {
    const [bootcamp, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);

    if (fieldArray == null) return;

    function prependStudentToBootcamp() {
        if (!bootcamp) return;

        setBootcamp(
            {
                ...bootcamp,
                students: [BootcampService.defaultStudent, ...bootcamp.students]
            } as BootcampTypes.Bootcamp
        );
    }

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