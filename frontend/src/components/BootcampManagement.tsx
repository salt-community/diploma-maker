import { BootcampResponse } from "../util/types"
import { EditText, EditTextarea } from 'react-edit-text';

type Props = {
    bootcamps: BootcampResponse[];
    deleteBootcamp: (i: number) => Promise<void>;
}

export default function BootcampManagement({ bootcamps, deleteBootcamp }: Props) {

    return (

        <div className="group relative">
            {
                bootcamps!.map((bootcamp, index) =>
                    <div className="block font-medium text-gray-700">
                        <label className="font-bold"> Name: </label>
                        <EditText defaultValue={bootcamp.name} />
                        <label className="font-bold"> Start Date: </label>
                        <EditText defaultValue={new Date(bootcamp.startDate).toLocaleDateString()} />
                        <button type="button" onClick={() => deleteBootcamp(index)} className="left-full ml-2 text-red-500 ">delete</button>
                        <hr />
                    </div>
                )
            }
        </div>

    )


}