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
                <option value="dotnet-winter-2024">Dotnet winter 2024</option>
                <option value="java-autumn-2023">Java Autumn 2023</option>
                <option value="js-spring-2024">JavaScript Spring 2024</option>
            </select>
            <input {...register("datebootcamp")} type="date" />
            <textarea {...register("names")} />
            <button>Choose</button>
            <input type="submit" value="Generate"/>
        </form>
        </> 
    )
}

