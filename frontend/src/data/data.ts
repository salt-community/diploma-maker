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

export const defaultEmailContent = {
  titleHeader: 'emailcontent_title',
  title: `<h1>Congratulations, {studentName}! 🎉</h1>`,
  descriptionHeader: 'emailcontent_description',
  description: `<p>We are thrilled to award you the Salt Diploma. Your hard work and dedication have paid off, and we are excited to see what you accomplish next.</p> <p>Keep striving for greatness, and remember that this is just the beginning of your journey. Well done on completing the bootcamp!</p>`
}