import { Routes, Route, Outlet, } from "react-router-dom";
import DiplomaMaking from './pages/Diplomaking/DiplomaMaking';
import { VertificationPage } from "./pages/Verifcation/VerificationPage";
import { useEffect, useState } from "react";
import { BootcampRequest, BootcampResponse, StudentUpdateRequestDto, EmailSendRequest, TemplateRequest, TemplateResponse, FormDataUpdateRequest, TrackResponse, MakeActiveSnapshotRequestDto, StudentResponse, Student, UserFontRequestDto, apiEndpointParameters } from "./util/types";
import { OverviewPage } from "./pages/Overview/OverviewPage";
import { NavBar } from "./pages/shared/Navbar/Navbar";
import BootcampManagement from "./pages/BootcampManagement/BootcampManagement";
import { TemplateCreatorPage } from "./pages/TemplateCreator/TemplateCreatorPage";
import { useLoadingMessage } from "./components/Contexts/LoadingMessageContext";
import { initApiEndpoints } from "./services/apiFactory";
import { VerificationInputPage } from "./pages/Verifcation/VerificationInputPage";
import { HistoryPage } from "./pages/History/HistoryPage";
import { HomePage } from "./pages/Homepage/HomePage"
import { Footer } from "./components/Footer/Footer";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { useBGLoadingMessage } from "./components/Contexts/LoadingBGMessageContext";
import { AlertPopup } from "./components/MenuItems/Popups/AlertPopup";
import { useCustomAlert } from "./components/Hooks/useCustomAlert";
import { ClerkAuthGuard } from "./components/Feature/Auth/ClerkAuthGaurd";
import { useUser } from "@clerk/clerk-react";
import SignInPage from "./pages/LoginPortal/sign-in";
import { getToken } from "./util/apiUtil";
import { generatePreviewImages } from "./util/previewImageUtil";

export default function App() {
  const [tracks, setTracks] = useState<TrackResponse[] | null>(null);
  const [templates, setTemplates] = useState<TemplateResponse[] | null>(null);

  const { setLoadingMessage, loadingMessage } = useLoadingMessage();
  const { setBGLoadingMessage, loadingBGMessage } = useBGLoadingMessage();
  const [tracksWithoutPreviewImages, setTracksWithoutPreviewImages] = useState<TrackResponse[] | null>(null);

  const { showPopup: BGshowPopup, popupContent: BGpopupContent, popupType: BGpopupType, customAlert: BGcustomAlert, closeAlert: BGcloseAlert } = useCustomAlert()
  const { user, isSignedIn } = useUser();
  
  let api = initApiEndpoints({
    endpointUrl: import.meta.env.VITE_API_URL,
    token: getToken 
  });
  
  useEffect(() => {
    if (isSignedIn) {
      if (!localStorage.getItem('isFirstLogin')) {
        setTimeout(() => {
          localStorage.setItem('isFirstLogin', 'false');
        }, 2000);
      }
    } else {
      localStorage.removeItem('isFirstLogin');
    }
    
    if (isSignedIn && !tracks) {
      getTemplates();
      getTracks();
    }
  }, [isSignedIn, tracks]);
  
  const refresh = async () => {
    const newTemplates = await api.getAllTemplates(setLoadingMessage);
    setTemplates(newTemplates);
    getTracks();
  }
  
  // State Update Functions
  const bootcampStateUpdateFromImagePreview = (response: StudentResponse) => {
    setTracks(prevTracks =>
      prevTracks!.map(track => ({
        ...track,
        bootcamps: track.bootcamps.map(bootcamp => ({
          ...bootcamp,
          students: bootcamp.students.map(student =>
            student.guidId === response.guidId
              ? {
                  ...student,
                  previewImageUrl: response.previewImageUrl,
                  previewImageLQIPUrl: response.previewImageLQIPUrl,
                }
              : student
          ),
        })),
      }))
    );
  };

  const bootcampStateUpdateFromNewFormData = (bootcampResponse: BootcampResponse) => {
    setTracks(prevTracks =>
      prevTracks!.map(track => ({
        ...track,
        bootcamps: track.bootcamps.map(bootcamp =>
          bootcamp.guidId === bootcampResponse.guidId
            ? { ...bootcamp, students: bootcampResponse.students, templateId: bootcampResponse.templateId }
            : bootcamp
        ),
      }))
    );
    setTracksWithoutPreviewImages(prevTracks =>
      prevTracks!.map(track => ({
        ...track,
        bootcamps: track.bootcamps.map(bootcamp =>
          bootcamp.guidId === bootcampResponse.guidId
            ? { ...bootcamp, students: bootcampResponse.students, templateId: bootcampResponse.templateId }
            : bootcamp
        ),
      }))
    );
  };
  

  // Bootcamp Endpoint
  const deleteBootcamp = async (guidId: string) => {
    await api.deleteBootcampById(guidId);
    await refresh();
  }

  const addNewBootcamp = async (bootcamp: BootcampRequest) => {
    await api.postBootcamp(bootcamp);
    await refresh();
  }

  const updateBootcamp = async (bootcamp: BootcampRequest) => {
    await api.updateBootcamp(bootcamp);
    await refresh();
  }

  const updateStudentThumbnails = async (pdfs: Uint8Array[], studentsInput: Student[], setLoadingMessageAndAlert: (message: string) => void): Promise<void> => {
    BGcustomAlert("loading", `${loadingBGMessage}`, "");
    await generatePreviewImages(pdfs, studentsInput, setBGLoadingMessage, bootcampStateUpdateFromImagePreview);
    BGcustomAlert("loadingfadeout", `${loadingBGMessage}`, "");
  }

  const UpdateBootcampWithNewFormdata = async (updateFormDataRequest: FormDataUpdateRequest, guidid: string): Promise<BootcampResponse> => {
    const bootcampResponse: BootcampResponse = await api.UpdateBootcampWithNewFormdata(updateFormDataRequest, guidid);
    bootcampStateUpdateFromNewFormData(bootcampResponse)
    return bootcampResponse;
  };

  // Students Endpoint
  const deleteStudent = async (id: string) => {
    await api.deleteStudentById(id);
    await refresh();
  }

  const updateStudentInformation = async (StudentRequest: StudentUpdateRequestDto) => {
    var StudentResponse = await api.updateSingleStudent(StudentRequest);
    await refresh();
    return StudentResponse
  }

  // Templates Endpoint
  const getTemplates = async () => {
    const templates: TemplateResponse[] = await api.getAllTemplates(setLoadingMessage);
    setTemplates(templates);
  }

  const addNewTemplate = async (template: TemplateRequest) => {
    await api.postTemplate(template);
    await refresh();
  }

  const updateTemplate = async (id: number, templateRequest: TemplateRequest) => {
    var templateResponse = await api.putTemplate(id, templateRequest);
    await refresh();
    return templateResponse
  }

  const deleteTemplate = async (id: number) => {
    await api.deleteTemplateById(id);
    await refresh();
  }

  // Email Endpoint
  const sendEmail = async (emailRequest: EmailSendRequest) => {
    await api.postEmail(emailRequest)
  }

  // HistorySnapshot Endpoint
  const getHistory = async () => {
    const historySnapshots = await api.getHistorySnapshots(setLoadingMessage);
    return historySnapshots;
  }

  const getHistoryByVerificationCode = async (verificationCode: string) => {
    const historySnapshots = await api.getHistoryByVerificationCode(verificationCode);
    return historySnapshots;
  }

  const changeActiveHistorySnapShot = async (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => {
    await api.makeActiveHistorySnapShot(snapshotUpdateRequest);
  }

  // Tracks Endpoint
  const getTracks = async () => {
    const tracks = await api.getAllTracks(setLoadingMessage);
    setTracks(tracks);
    setTracksWithoutPreviewImages(JSON.parse(JSON.stringify(tracks)));
  }

  // User Fonts Endpoint
  const postUserFonts = async (userFontsRequestsDto: UserFontRequestDto[]) => {
    await api.postUserFonts(userFontsRequestsDto);
  }

  return (

    <>
      <div className="app-wrapper" style={{
        minHeight: "100vh",
      }}>
      {isSignedIn && <NavBar />}
      <Routes>
        {isSignedIn != undefined &&
          <>
            {/* PUBLIC ROUTES */}
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/verify" element={<VerificationInputPage />} />
            <Route path="/verify/:verificationCode" element={<VertificationPage getHistoryByVerificationCode={getHistoryByVerificationCode} />} />
            <Route path="/" element={<HomePage userName={user?.fullName} signedIn={isSignedIn}/>} />
            <Route path="/home" element={<HomePage userName={user?.fullName} signedIn={isSignedIn}/>} />
          </>
        }
        {/* PRIVATE ROUTES */}
        <Route
          path="/"
          element={
            <ClerkAuthGuard>
              {/* <AlertPopup title={loadingMessage} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert} durationOverride={3500} /> */}
              <AlertPopup title={loadingBGMessage} text={BGpopupContent[1]} popupType={BGpopupType} show={BGshowPopup} onClose={BGcloseAlert} leftAligned={true} />
              <Outlet />
            </ClerkAuthGuard>
          }
        >
          <Route path="pdf-creator" element={<DiplomaMaking tracks={tracksWithoutPreviewImages} templates={templates} UpdateBootcampWithNewFormdata={UpdateBootcampWithNewFormdata} updateStudentThumbnails={updateStudentThumbnails} setLoadingMessage={setLoadingMessage} addNewBootcamp={addNewBootcamp}/>} />
          {/* <Route path="pdf-creator/:track/:bootcamp" element={<DiplomaMaking tracks={tracks} templates={templates} UpdateBootcampWithNewFormdata={UpdateBootcampWithNewFormdata} updateStudentThumbnails={updateStudentThumbnails} setLoadingMessage={setLoadingMessage} addNewBootcamp={addNewBootcamp}/>} /> */}
          <Route path="bootcamp-management" element={<BootcampManagement tracks={tracks} deleteBootcamp={deleteBootcamp} addNewBootcamp={addNewBootcamp} updateBootcamp={updateBootcamp}  />} />
          <Route path="overview" element={<OverviewPage tracks={tracks} deleteStudent={deleteStudent} updateStudentInformation={updateStudentInformation} sendEmail={sendEmail} templates={templates} setLoadingMessage={setLoadingMessage} />} />
          <Route path={"/template-creator"} element={<TemplateCreatorPage templates={templates} addNewTemplate={addNewTemplate} updateTemplate={updateTemplate} deleteTemplate={deleteTemplate} postUserFonts={postUserFonts}/>} />
          <Route path="history" element={<HistoryPage tracks={tracks} getHistory={getHistory} changeActiveHistorySnapShot={changeActiveHistorySnapShot}  />} />
          <Route path="*" element={<ErrorPage code={404} />} />
        </Route>

      </Routes>
      </div>

      <Footer />
    </>
  );
}




