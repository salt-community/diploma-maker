export const openWindowfromBlob = async (input: Blob) => {
    window.open(URL.createObjectURL(input))
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