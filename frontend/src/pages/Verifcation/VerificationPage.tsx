import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getStudentById } from "../../services/studentService";
import QRCode from "react-qr-code";
import { initApiEndpoints } from "../../services/apiFactory";
import { StudentResponse } from "../../util/types";
/*
https://www.npmjs.com/package/react-qr-code
*/

type Props = {
    getStudentByVerificationCode: (guidId: string) => void
}

export function VertificationPage( { getStudentByVerificationCode }: Props) {
    const { guidId } = useParams<{ guidId: string }>();

    const { isLoading, data: diploma } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getStudentByVerificationCode(guidId || ''),
        onSuccess: (data: StudentResponse) => {
            console.log("Success", data);
        }
    })

    if (isLoading) {
        return (<h1>Loading...</h1>)
    }

    return (
        <>
            <h1></h1>
            {/* <h1 className="mb-4 text-5xl text-center font-extrabold leading-none tracking-tight text-gray-900 ">Congratulations!</h1> */}
            {/* @ts-ignore */}
            {/* <h2 className="mb-4 text-3xl text-center font-bold leading-none tracking-tight text-gray-900 ">This is to certify that {diploma!.studentName} successfully completed the traning on {new Date(diploma!.graduationDate).toLocaleDateString()} from the {diploma!.bootcamp.name}.</h2> */}
            {/* <h2 className="mb-4 text-3xl text-center font-bold leading-none tracking-tight text-gray-900 ">This diploma is valid and authentic.</h2> */}
            {/* <div className="flex justify-center mt-4"> */}
                {/* <QRCode 
                    size={128}
                    value={`http://localhost:5173/${guidId}`}
                /> */}
            {/* </div> */}
        </>
    )
}

