import { Bootcamp } from "../api/models";
import useEntity from "../hooks/useEntity";

export default function BootcampManager() {
    const bootcamps = useEntity<Bootcamp>('Bootcamp');

    const headers = ['Track', 'Students', 'Graduation Date'];

    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        { headers.map(header => <th key={header}>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    { bootcamps.entities.map(bootcamp => (
                        <tr key={bootcamp.guid}>
                            <td>
                                { bootcamp.}
                            </td>
                        </tr>
                    )) }
                    <tr>
                        <th>3</th>
                        <td>Brice Swyre</td>
                        <td>Tax Accountant</td>
                        <td>Red</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}