import BootcampManageTable from "../../components/Feature/BootcampManage/BootcampManageTable";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
}

export default function BootcampManagement({ bootcamps, deleteBootcamp, addNewBootcamp, updateBootcamp, tracks }: Props) {
  return (
    <BootcampManageTable bootcamps={bootcamps} deleteBootcamp={deleteBootcamp} addNewBootcamp={addNewBootcamp} updateBootcamp={updateBootcamp} tracks={tracks} />
  );
}
