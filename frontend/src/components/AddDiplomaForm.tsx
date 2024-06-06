import { useForm, SubmitHandler, FieldValues } from "react-hook-form"

type Props = {
    updateStudentNames: (names: string) => void;
}

export default function AddDeplomaForm({updateStudentNames}: Props){
    const {register, handleSubmit} = useForm();

    function submitAndMakePDF(data: FieldValues){
        console.log(data.names);
        updateStudentNames(data.names);
    }

    return (
        <>
        <form onSubmit={handleSubmit(data => {submitAndMakePDF(data)})}>
            <select {...register("classname")}>
                <option value="dotnet-winter-2024">Dotnet winter 2024</option>
                <option value="java-autumn-2023">Java Autumn 2023</option>
                <option value="js-spring-2024">JavaScript Spring 2024</option>
            </select>
            <input {...register("date-of-bootcamp")} type="date" />
            <textarea {...register("names")} />
            <button>Apply Names</button>
        </form>
        </> 
    )
}

