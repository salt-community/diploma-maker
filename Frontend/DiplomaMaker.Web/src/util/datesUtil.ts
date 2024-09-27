const dateoptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: 'numeric',
    timeZone: 'Europe/Stockholm'
};
  
export const dateFormatter = new Intl.DateTimeFormat('en-GB', dateoptions);

export const utcFormatter = (date: Date) => {
    const utcDate = new Date(date);
    const stockholmDateString = dateFormatter.format(utcDate);
    return stockholmDateString;
}

export const utcFormatterSlash = (date: Date) => {
    const dateConverted = new Date(date);
    const utcYear = dateConverted.getUTCFullYear();
    const utcMonth = (dateConverted.getUTCMonth() + 1).toString().padStart(2, '0');
    const utcDay = dateConverted.getUTCDate().toString().padStart(2, '0');
    return `${utcYear}-${utcMonth}-${utcDay}`;
}