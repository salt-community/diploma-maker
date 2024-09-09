import { SaltData, Student } from "../util/types";

export function SaltDataDefaultStudent(saltData: SaltData): SaltData {
  const defuatlStudent: Student = {
    name: "Example Student",
    email: "test@gmail.com",
    verificationCode: "00000"
   
};

  return {
      ...saltData,
      students: [defuatlStudent]
  };
}

export const nullTemplateInstance = {
  positionX: null,
  positionY: null,
  sizeWidth: null,
  sizeHeight: null,
  align: null,
  fontSize: null,
  font: null,
  fontColor: null,
}

export const defaultOverviewCardImage = "https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg"