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
                    <p className="block text-lg font-medium text-gray-700">
                        <EditText defaultValue={bootcamp.name} />
                        <button type="button" onClick={() => deleteBootcamp(index)} className="left-full ml-2 text-red-500 ">delete</button>
                    </p>
                )
            }
        </div>

    )


}