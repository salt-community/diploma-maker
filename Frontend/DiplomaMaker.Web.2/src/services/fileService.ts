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

export const downloadJsonFile = (json: unknown, title: string) => {
    const blob = new Blob([JSON.stringify(json)], {
        type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.json`;
    link.click();

    URL.revokeObjectURL(url);
};
