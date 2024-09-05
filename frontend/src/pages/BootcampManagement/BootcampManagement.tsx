import BootcampManageTable from "../../components/Feature/BootcampManage/BootcampManageTable";
import { CustomAlertPopupProps, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";

type Props = {
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
}

export default function BootcampManagement({ deleteBootcamp, addNewBootcamp, updateBootcamp, tracks }: Props) {
  return (
    <BootcampManageTable 
      deleteBootcamp={deleteBootcamp} 
      addNewBootcamp={addNewBootcamp} 
      updateBootcamp={updateBootcamp} 
      tracks={tracks} 
    />
  );
}
