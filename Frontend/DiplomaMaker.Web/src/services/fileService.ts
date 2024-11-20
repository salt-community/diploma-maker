/*
    FileService
    
    A collection of methods that supports downloading
    and uploading files.
*/


import Papa from 'papaparse';

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
export function downloadJsonFile(fileObject: unknown, title: string) {
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

export type Student = {
    name: string,
    email: string
};

export type Bootcamp = {
    track: string,
    graduationDate: Date,
    students: Student[]
};

export function parseCSVFileIntoStudents(file: File) {
    return new Promise<Student[]>((resolve) => {
        Papa.parse<Student>(file, {
            header: true,
            complete: function (results) {
                resolve(results.data);
            }
        });
    });
}

export async function parseJsonFileIntoBootcamp(file: File) {
    const jsonObject = JSON.parse(await readTextFile(file));
    const track = Object.values(jsonObject)[0] as string;
    const graduationDate = new Date(Date.parse(Object.values(jsonObject)[1] as string));

    if (!track)
        throw new Error("Track field is missing");

    if (!graduationDate)
        throw new Error("Graduation date is missing or in an incorrect format");

    const students = (Object.values(jsonObject)[2] as Record<string, string>[]).map((entry: Record<string, string>) => {
        const name: string = Object.values(entry)[0];
        const email: string = Object.values(entry)[1];

        if (!name || !email)
            throw new Error("Name or email field of one or more students is missing");

        return {
            name,
            email
        } as Student;
    });

    const bootcamp: Bootcamp = {
        track,
        graduationDate,
        students
    }

    return bootcamp;
}
