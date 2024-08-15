import BootcampManageTable from "../../components/Feature/BootcampManage/BootcampManageTable";
import { PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
  showPopup: Boolean;
  customAlert: (alertType: PopupType, title: string, content: string) => void;
  closeAlert: () => void;
}

export default function BootcampManagement({ bootcamps, deleteBootcamp, addNewBootcamp, updateBootcamp, tracks, showPopup, customAlert, closeAlert }: Props) {
  return (
    <BootcampManageTable bootcamps={bootcamps} deleteBootcamp={deleteBootcamp} addNewBootcamp={addNewBootcamp} updateBootcamp={updateBootcamp} tracks={tracks} showPopup={showPopup} customAlert={customAlert} closeAlert={closeAlert}/>
  );
}
