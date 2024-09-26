export const openWindowfromBlob = async (input: Blob) => {
    window.open(URL.createObjectURL(input))
}

export const downloadZipFile = async (input: Blob, bootcampName: string) => {
    const url = URL.createObjectURL(input);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bootcampName}.zip`;
    link.click();
    URL.revokeObjectURL(url);
}

  
export const openPrintWindowfromBlob = async (input: Blob) => {
    const blobUrl = URL.createObjectURL(input);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
        printWindow.document.write(`
        <html>
            <head><title>Generated Bootcamp Pdfs</title></head>
            <body style="margin: 0;">
            <iframe src="${blobUrl}" style="border: none; width: 100%; height: 100%;" onload="this.contentWindow.print();"></iframe>
            </body>
        </html>
        `);
        printWindow.document.close();
        printWindow.focus();

        printWindow.onafterprint = () => {
        URL.revokeObjectURL(blobUrl);
        printWindow.close();
        };
    }
}

export const downloadJsonFile = (json: any, title: string) => {
    if (typeof window !== "undefined") {
        const blob = new Blob([JSON.stringify(json)], {
        type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
};

export const cloneDeep = (obj: any) => JSON.parse(JSON.stringify(obj));