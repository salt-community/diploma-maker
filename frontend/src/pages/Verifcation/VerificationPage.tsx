import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import QRCode from "react-qr-code";
import { StudentResponse } from "../../util/types";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";

type Props = {
    getStudentByVerificationCode: (verificationCode: string) => void
}

export function VertificationPage( { getStudentByVerificationCode }: Props) {
    const { verificationCode } = useParams<{ verificationCode: string }>();

    const { isLoading, data: student } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getStudentByVerificationCode(verificationCode || ''),
        onSuccess: (data: StudentResponse) => {
            console.log("Success", data);
        }
    })

    if (isLoading) {
        return (<SpinnerDefault />)
    }

    return (
        <>
            <h1 className="mb-4 text-5xl text-center font-extrabold leading-none tracking-tight text-gray-900 ">Congratulations!</h1>
            {/* @ts-ignore */}
            <h2 className="mb-4 text-3xl text-center font-bold leading-none tracking-tight text-gray-900 ">This is to certify that {student!.name} with id {student!.verificationCode} successfully completed the traning on {/*new Date(diploma!.graduationDate).toLocaleDateString()*/} from the {/*diploma!.bootcamp.name*/}.</h2>
            <h2 className="mb-4 text-3xl text-center font-bold leading-none tracking-tight text-gray-900 ">This diploma is valid and authentic.</h2>
            <div className="flex justify-center mt-4">
                <QRCode 
                    size={128}
                    value={`http://localhost:5173/${verificationCode}`}
                />
            </div>
        </>
    )
}

