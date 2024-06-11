import { BootcampResponse } from "../util/types"
import { EditText, EditTextarea } from 'react-edit-text';

type Props = {
    bootcamps: BootcampResponse[];
    deleteBootcamp: (i: number) => Promise<void>;
}

export default function BootcampManagement({ bootcamps, deleteBootcamp }: Props) {

    return (
        <div className="block font-medium text-gray-700">
            {
                bootcamps!.map((bootcamp, index) =>
                    <div>
                        <EditText defaultValue={bootcamp.name} />
                        <p></p>
                        <button type="button" onClick={() => deleteBootcamp(index)} className="left-full ml-2 text-red-500 ">delete</button>
                        <hr />
                    </div>
                )
                
            }
            <EditText placeholder="New bootcamp name" />
            <p></p>
            <button type="button" className="text-green-500">Add</button>
        </div>

    )


}