import { Bootcamp, Track } from "../api/models";
import useEntity from "../hooks/useEntity";
import Dropdown from "./Dropdown";

export default function BootcampManager() {
    const bootcampEntities = useEntity<Bootcamp>('Bootcamp');
    const trackEntities = useEntity<Track>('Track');

    const bootcamps = bootcampEntities.entities.sort((bootcampA, bootcampB) =>
        bootcampA.graduationDate.getTime() - bootcampB.graduationDate.getTime());

    const headers = ['Track', 'Graduation Date', 'Students'];

    const onChangeTrack = (bootcampGuid: string, trackGuid: string) => {
        const bootcamp = bootcampEntities.entities.find(bootcamp => bootcamp.guid == bootcampGuid);

        if (!bootcamp)
            throw new Error(`A bootcamp with guid @{bootcampGuid} cannot be found in cache`);

        bootcampEntities.putEntity({
            ...bootcamp,
            trackGuid
        });
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            {headers.map(header => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {bootcampEntities.entities.map(bootcamp => {
                            const bootcampTrack = trackEntities.entities.find(track => track.guid == bootcamp.trackGuid);

                            if (!bootcampTrack)
                                return <td>Error: No track</td>

                            const dropdown = <Dropdown
                                title={bootcampTrack.name}
                                items={trackEntities.entities}
                                onClick={(item) => onChangeTrack(bootcamp.guid, item.guid)} />

                            return (
                                <tr key={bootcamp.guid}>
                                    <td>
                                        {dropdown}
                                    </td>
                                    <td>
                                        {bootcamp.graduationDate.toString()}
                                    </td>
                                    <td>
                                        {`${bootcamp.studentGuids.length} Students`}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}