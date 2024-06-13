
type Props = {
    deleteBootcamp: (i: number) => Promise<void>;
}


export default function AddNewBootcampForm({ deleteBootcamp }: Props) {
    return (
        <>
            {/* Add new bootcamp */}
            <br />
            <tr>
                <td>
                    <input type="text" {...register("newname")} placeholder="Bootcamp name" className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </td>
                <td>
                    <input type="date" {...register("newstartdate")} className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </td>
                <td>
                    <input type="date" {...register("newgraduatedate")} className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </td>
                <td>
                    <button type="button" className="left-full ml-2 text-green-500 ">Add</button>
                </td>
            </tr>

        </>
    )
}