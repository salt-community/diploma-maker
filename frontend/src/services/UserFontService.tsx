import { apiEndpointParameters, FontType, UserFontRequestDto, UserFontResponseDto } from "../util/types";

export const getUserFonts = async (apiParameters: apiEndpointParameters): Promise<UserFontResponseDto[]> => {
    try {
        const response = await fetch(`${apiParameters.endpointUrl}/api/UserFonts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data: UserFontResponseDto[] = await response.json();

        for (let i = 0; i < data.length; i++) {
            // data[i].file = await getFontPreviewImage(apiUrl, data[i].name, data[i].fontType)
            data[i].fileUrl = `${apiParameters.endpointUrl}/api/Blob/UserFonts/${data[i].name}?fontType=${data[i].fontType}`;
            // data[i].fileUrl = `${apiUrl}/api/Blob/UserFonts/fonts/${data[i].name}.woff`;
        }

        return data;
    } catch (error) {
        console.error('Error fetching user fonts:', error);
        throw error;
    }
}


export const getFontPreviewImage = async (apiParameters: apiEndpointParameters, fontName: string, fontType: FontType): Promise<Blob> => {
    try {
        const response = await fetch(`${apiParameters.endpointUrl}/api/Blob/UserFonts/${fontName}?fontType=${fontType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fontBlob = await response.blob();
        console.log("Font preview image fetched successfully");
        return fontBlob;
    } catch (error) {
        console.error('Error fetching font preview image:', error);
        throw error;
    }
}

export const postUserFonts = async (apiParameters: apiEndpointParameters, userFonts: UserFontRequestDto[]): Promise<UserFontResponseDto[]> => {
    try {
      const formData = new FormData();
      userFonts.forEach((font, index) => {
        formData.append(`UserFontRequests[${index}].Name`, font.Name);
        formData.append(`UserFontRequests[${index}].FontType`, font.FontType);
        formData.append(`UserFontRequests[${index}].File`, font.File);
      });
  
      const response = await fetch(`${apiParameters.endpointUrl}/api/UserFonts`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: UserFontResponseDto[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error posting user fonts:', error);
      throw error;
    }
  };