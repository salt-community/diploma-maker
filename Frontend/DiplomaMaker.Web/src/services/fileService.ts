/*
    FileService
    
    A collection of methods that supports downloading
    and uploading files.
*/

/*
    Accepts a File object from an <input type="file"> element
    and returns a string.
*/
export async function readTextFile(file: File) {
    return new Promise<string>((resolve) => {
        const fileReader = new FileReader();

        fileReader.addEventListener("load", (event) => {
            if (!event?.target?.result)
                throw new Error(`File ${file} failed to load`);

            resolve(event?.target?.result as string);
        });

        fileReader.readAsText(file);
    });
}

/*
    Accepts a File object from an <input type="file"> element
    and returns a string.
*/
export async function readDataUrlFile(file: File) {
    return new Promise<string>((resolve) => {
        const fileReader = new FileReader();

        fileReader.addEventListener("load", (event) => {
            if (!event?.target?.result)
                throw new Error(`File ${file} failed to load`);

            resolve(event?.target?.result as string);
        });

        fileReader.readAsDataURL(file);
    });
}

/*
    Accepts any object and downloads it to the clients computer 
    as a json file.
*/
export const downloadJsonFile = (fileObject: unknown, title: string) => {
    const blob = new Blob([JSON.stringify(fileObject)], {
        type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.json`;
    link.click();

    URL.revokeObjectURL(url);
};
