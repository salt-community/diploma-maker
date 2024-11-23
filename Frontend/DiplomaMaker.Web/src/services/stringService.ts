export function formatDate_YYYY_mm_dd(date: Date) {
    date = new Date(date);
    return date.toISOString().split('T')[0];
}

export function blobToBase64String(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

export function base64StringWithoutMetaData(base64: string) {
    return base64.split(",")[1];
}