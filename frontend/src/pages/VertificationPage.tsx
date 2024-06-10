import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getDiplomaById } from "../services/diplomaService";

export function VertificationPage(){
    const { guidId } = useParams<{ guidId: string }>(); 

    const {isLoading, data: diploma} = useQuery({
        queryKey: ['getDiplomaById'],
        queryFn: () => getDiplomaById(guidId || ''),
        onSuccess: (data) => {
            console.log("Success", data);
        }
    })

    if(isLoading){
        return (<h1>Loading...</h1>)
    }


    return (
        <>
        <h1>Congratulations!</h1>
        <h2>This is to certify that {diploma!.studentName} successfully completed the traning on {new Date(diploma!.graduationDate).toLocaleDateString()} from the {diploma!.bootcamp.name}.</h2>
        <h2>This diploma is valid and authentic.</h2>
        </>
    )
}

