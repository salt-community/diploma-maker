import { utcFormatter } from "../../../util/datesUtil";
import { Student } from "../../../util/types";
import { LazyImageLoader } from "../../Content/LazyImageLoader";
import { ModifyButton } from "../../MenuItems/Buttons/ModifyButton";
import { RemoveButton } from "../../MenuItems/Buttons/RemoveButton";
import { SelectButton } from "../../MenuItems/Buttons/SelectButton";
import { VerifyIcon } from "../../MenuItems/Icons/VerifyIcon";
import { SpinnerDefault } from "../../MenuItems/Loaders/SpinnerDefault";
import { PaginationMenu } from "../../MenuItems/PaginationMenu";
import { Popup404 } from "../../MenuItems/Popups/Popup404";

type Props = {
  visibleItems: Student[];
  selectedItems: Student[];
  currentPage: number;
  totalPages: number
  handleNextPage: () => void;
  handlePrevPage: () => void;
  defaultImg: string;
  handleImageLoad: (index: number) => void,
  loading: boolean;
  navigateToVerificationPage: (verificationCode: string) => void;
  startIndex: number;
  itemsPerPage: number;
  api: string;
  modifyHandler: (guidId: string) => void;
  deleteHandler: (id: string) => Promise<void>;
  imageLoadedStates: boolean[];
  showStudentInfohandler: (student: Student) => void;
}

export const DiplomaCardContainer = ({ 
  visibleItems, 
  selectedItems, 
  currentPage, 
  totalPages,
  handleNextPage,
  handlePrevPage,
  defaultImg,
  handleImageLoad,
  loading,
  navigateToVerificationPage,
  startIndex,
  itemsPerPage,
  api,
  modifyHandler,
  deleteHandler,
  imageLoadedStates,
  showStudentInfohandler,
}: Props) => {
  return (
    <section className='overview-page__list-module'>
        <div className='overview-page__list-module-card-container'>
            {loading ? (
                <SpinnerDefault classOverride="spinner" />
            ) : (
                visibleItems.length > 0 ? visibleItems.map((student: Student, index) => {
                    const isVisible = index >= startIndex && index < startIndex + itemsPerPage;
                    const defaultImg = "https://res.cloudinary.com/dlw9fdrql/image/upload/v1718105458/diploma_xmqcfi.jpg";
                    return (
                        <button key={student.guidId} className={`list-module__item ${isVisible ? 'visible' : 'hidden'}`}>
                            {!student.previewImageUrl && <p className='list-module__item-title'>{student.name}</p>}
                            <LazyImageLoader 
                                previewImageLQIPUrl={student.previewImageLQIPUrl ? `${api}${student.previewImageLQIPUrl}` : defaultImg} 
                                previewImageUrl={student.previewImageUrl ? `${api}${student.previewImageUrl}` : defaultImg} 
                                loadTrigger={() => handleImageLoad(index)}
                            />
                            <section className='list-module__item-menu'>
                                <ModifyButton text='Modify' onClick={() => modifyHandler(student.guidId)} />
                                <RemoveButton text='Remove' onClick={() => deleteHandler(student.guidId)} />
                                <SelectButton classOverride="email-btn" selectButtonType={'email'} onClick={() => showStudentInfohandler(student)} />
                            </section>
                            {student.lastGenerated && imageLoadedStates[index] && 
                                <div onClick={() => navigateToVerificationPage(student.verificationCode)} className='list-module__item-menu--verifiedcontainer' data-student-lastgenerated={`last generated: ${utcFormatter(student.lastGenerated)}`}>
                                    <VerifyIcon />
                                </div>
                            }
                        </button>
                    );
                }) :
                <Popup404 text='No Diplomas Generated Yet For This Bootcamp' />
            )}
        </div>
        {selectedItems.length > 0 &&
            <PaginationMenu
                containerClassOverride='overview-page__footer'
                buttonClassOverride='pagination-button'
                textContainerClassOverride='pagination-info'
                currentPage={currentPage}
                totalPages={totalPages}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
            />
        }
    </section>
  );
};