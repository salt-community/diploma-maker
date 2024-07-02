import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getDiplomaById } from "../../services/diplomaService";
import QRCode from "react-qr-code";
/*
https://www.npmjs.com/package/react-qr-code
*/

export function VertificationPage() {
    const { guidId } = useParams<{ guidId: string }>();

    const { isLoading, data: diploma } = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getDiplomaById(guidId || ''),
        onSuccess: (data) => {
            console.log("Success", data);
        }
    })

    if (isLoading) {
        return (<h1>Loading...</h1>)
    }



    return (
        <>
            <h1 className="mb-4 text-5xl text-center font-extrabold leading-none tracking-tight text-gray-900 ">Congratulations!</h1>
            {/* @ts-ignore */}
            <h2 className="mb-4 text-3xl text-center font-bold leading-none tracking-tight text-gray-900 ">This is to certify that {diploma!.studentName} successfully completed the traning on {new Date(diploma!.graduationDate).toLocaleDateString()} from the {diploma!.bootcamp.name}.</h2>
            <h2 className="mb-4 text-3xl text-center font-bold leading-none tracking-tight text-gray-900 ">This diploma is valid and authentic.</h2>
            <div className="flex justify-center mt-4">
                <QRCode 
                    size={128} // Increase the size for better visibility
                    value={`http://localhost:5173/${guidId}`}
                />
            </div>
        </>
    )
}

