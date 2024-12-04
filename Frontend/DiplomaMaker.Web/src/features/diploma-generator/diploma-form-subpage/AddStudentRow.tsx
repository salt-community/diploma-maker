import { BootcampService } from "@/services";
import { UserAdd01Icon } from "hugeicons-react";
import { DiplomaFormProps } from "./DiplomaFormProps";

export function AddStudentRow({ fieldArray }: DiplomaFormProps) {
  if (fieldArray == null) return;

  return (
    <button
      className="w-ful btn btn-outline btn-secondary mt-4"
      onClick={() => {
        fieldArray.append(BootcampService.defaultStudent);
      }}
    >
      <UserAdd01Icon size={20} />
      Add Student
    </button>
  );
}
