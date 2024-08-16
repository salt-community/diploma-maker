import BootcampManageTable from "../../components/Feature/BootcampManage/BootcampManageTable";
import { CustomAlertPopupProps, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
  customAlertProps: CustomAlertPopupProps;
}

export default function BootcampManagement({ bootcamps, deleteBootcamp, addNewBootcamp, updateBootcamp, tracks, customAlertProps }: Props) {
  return (
    <BootcampManageTable 
      bootcamps={bootcamps} 
      deleteBootcamp={deleteBootcamp} 
      addNewBootcamp={addNewBootcamp} 
      updateBootcamp={updateBootcamp} 
      tracks={tracks} 
      customAlertProps={customAlertProps}
    />
  );
}
