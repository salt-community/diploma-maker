import { api } from "./apiUtil";
import { convertUint8ArrayToBase64 } from "./fileConversionUtil";
import { Student, studentImagePreview, StudentResponse } from "./types";

export const generatePreviewImages = async (pdfs: Uint8Array[], students: Student[], setBGLoadingMessage: (message: string) => void, setBootcamps: (response: StudentResponse) => void): Promise<void> => {
    const pdfConversionRequests: studentImagePreview[] = []; 

    for (let i = 0; i < pdfs.length; i++) {
        setBGLoadingMessage(`Converting pdfs to blob ${i + 1}/${pdfs.length}`);

        const base64String = convertUint8ArrayToBase64(pdfs[i]);

        await pdfConversionRequests.push({
        studentGuidId: students[i].guidId,
        image: base64String
        });
    }

    try {
        for (let i = 0; i < pdfConversionRequests.length; i++) {
        setBGLoadingMessage(`Converting & Compressing Thumbnails ${i + 1}/${pdfConversionRequests.length}`)
        const response: StudentResponse = await api.updateStudentPreviewImage(pdfConversionRequests[i])
        setBootcamps(response);
        }

        setBGLoadingMessage("Finished!");
        
    } catch (error) {
        setBGLoadingMessage(`Failed to Update PreviewImages!. ${error.message || 'Unknown error'}`)
    }
}