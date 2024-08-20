import { FontType, UserFontResponseDto } from "../util/types";

export const getUserFonts = async (apiUrl: string): Promise<UserFontResponseDto[]> => {
    try {
        const response = await fetch(`${apiUrl}/api/UserFonts`, {
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
            data[i].fileUrl = `${apiUrl}/api/Blob/UserFonts/${data[i].name}?fontType=${data[i].fontType}`;
        }

        return data;
    } catch (error) {
        console.error('Error fetching user fonts:', error);
        throw error;
    }
}


export const getFontPreviewImage = async (apiUrl: string, fontName: string, fontType: FontType): Promise<Blob> => {
    try {
        const response = await fetch(`${apiUrl}/api/Blob/UserFonts/${fontName}?fontType=${fontType}`, {
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

