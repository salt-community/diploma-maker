import { useForm, FieldValues } from "react-hook-form"

type FormData = {
    classname: string;
    datebootcamp: string;
    names: string[];
};

type Props = {
    /*updateStudentNames: (names: string) => void;*/
    SetFormInfo: (data: any) => void;
}

export default function AddDiplomaForm({/*updateStudentNames,*/ SetFormInfo}: Props){
    const {register, handleSubmit} = useForm<FormData>();

    function submitAndMakePDF(data: FieldValues){
        console.log(data.names);
        // updateStudentNames(data.names);
        const formData: FormData = {
            classname: data.classname,
            datebootcamp: data.datebootcamp,
            names: data.names.split('\n').map(name => name.trim()).filter(name => name !== "")
        }
        console.log(formData);
        SetFormInfo(formData);
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
            <button onClick={(e) => submitAndMakePDF(e)}>Apply Names</button>
        </form>
        </> 
    )
}

