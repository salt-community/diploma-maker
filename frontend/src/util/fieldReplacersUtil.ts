export const populateIntroField = (input: string): string => {
    return input
}
  
export const populateNameField = (input: string, studentname: string): string => {
    return input
        .replace('{studentname}', studentname)
}

export const populateFooterField = (input: string, classname: string, datebootcamp: string): string => {
    return input
        .replace('${classname}', classname)
        .replace('${datebootcamp}', datebootcamp);
}

export const populateField = (input: string, classname: string, datebootcamp: string, studentname: string): string => {
    return input
        .replace('{classname}', classname)
        .replace('{datebootcamp}', datebootcamp)
        .replace('{studentname}', studentname)
}

export const populateIdField = (input: string, verificationCode: string): string => {
    return input
        .replace('{id}', verificationCode)
}

export const getDisplayNameFromBootcampName = (bootcampName: string) => {
    return bootcampName.includes("dnfs") ? 'Fullstack C# Dotnet'
            : bootcampName.includes("jfs") ? 'Fullstack Java'
            : bootcampName.includes("jsfs") ? 'Fullstack Javascript'
            : 'ERR READING BOOTCAMP NAME';
}