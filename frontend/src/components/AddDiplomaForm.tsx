import { useForm, FieldValues } from "react-hook-form"

type FormData = {
    classname: string;
    datebootcamp: string;
    names: string;
};

type Props = {
    SetFormInfo: (data: any) => void;
}


export default function AddDiplomaForm({SetFormInfo}: Props){
    const {register, handleSubmit} = useForm<FormData>();

    function submitAndMakePDF(data: FieldValues){
        console.log(data);
        SetFormInfo(data);
    }

    return (
        <>
        <form onSubmit={handleSubmit(data => {submitAndMakePDF(data)})}>
            <select {...register("classname")}>
                <option value=".Net Fullstack">Dotnet</option>
                <option value="Java Fullstack">Java</option>
                <option value="Javascirpt Fullstack">JavaScript</option>
            </select>
            <input {...register("datebootcamp")} type="date" />
            <textarea {...register("names")} />
            <button>Choose</button>
            <input type="submit" value="Generate"/>
        </form>
        </> 
    )
}

