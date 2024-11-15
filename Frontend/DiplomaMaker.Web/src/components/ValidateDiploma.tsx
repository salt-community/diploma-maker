import { Diploma } from "../api/models";
import useEntity from "../hooks/useEntity";

export default function ValidateDiploma() {
    const templateFileGuid = "a21b353e-60b6-42b5-b03a-ba23df76e236";
    const basePdfGuid = "b21b353e-60b6-42b5-b03a-ba23df76e236";
    const templateGuid = "c21b353e-60b6-42b5-b03a-ba23df76e236";
    const studentGuid = "d21b353e-60b6-42b5-b03a-ba23df76e236";
    const trackGuid = "e21b353e-60b6-42b5-b03a-ba23df76e236";
    const bootcampGuid = "f21b353e-60b6-42b5-b03a-ba23df76e236";
    const diplomaGuid = "a31b353e-60b6-42b5-b03a-ba23df76e236";

    const diplomaEntities = useEntity<Diploma>("Diploma");
    const diploma = diplomaEntities.entityByGuid("a31b353e-60b6-42b5-b03a-ba23df76e236");

    if (!diploma) {
        console.log("No diploma")
        return;
    }

    console.log(diploma);

    return (
        <>
            <p>ValidateDiploma</p>
        </>
    );
}