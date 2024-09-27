import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Student } from '../util/types';
import { PopupType } from '../components/MenuItems/Popups/AlertPopup';

type TabularData = {
  [key: string]: string;
};


export const parseCSV = (fileData: string): Promise<TabularData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileData, {
      header: false, 
      complete: (result) => {
        const data = result.data as string[][];
        const parsedData = data.map((row) => {
          const rowObj: TabularData = {};
          row.forEach((cell, cellIndex) => {
            rowObj[`Column${cellIndex + 1}`] = cell; 
          });
          return rowObj;
        });
        resolve(parsedData);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

export const parseExcel = (fileData: ArrayBuffer): TabularData[] => {
  const workbook = XLSX.read(fileData, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[sheetName], { header: 1 });

  const parsedData = worksheet.map((row: string[]) => {
    const rowObj: TabularData = {};
    row.forEach((cell, index) => {
      rowObj[`Column${index + 1}`] = cell;  
    });
    return rowObj;
  });

  return parsedData;
};

export const parseJSON = (fileData: string): TabularData[] => {
  return JSON.parse(fileData) as TabularData[];
};

export const ParseFileData = async (
  file: File, 
  customAlert?: (alertType: PopupType, title: string, content: string) => void
): Promise<Student[]> => {
  if (!file) return [];

  return new Promise<Student[]>((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const fileData = e.target!.result as string;
      try {
        let parsedData: TabularData[] = [];
        if (file.type === 'text/csv') {
          parsedData = await parseCSV(fileData);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          parsedData = parseExcel(e.target!.result as ArrayBuffer);
        } else if (file.type === 'application/json') {
          parsedData = parseJSON(fileData);
        } else {
          alert('Unsupported file format');
          resolve([]);
          return;
        }

        // Check for required columns instead of field names
        const emailRegex = new RegExp("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}$");
        const data: Student[] = parsedData
          .filter(item => item['Column1'])  // Check if there's a value in 'Column1' (name)
          .map(item => {
            return {
              name: item['Column1'],  // Assume 'Column1' is the name
              email: item['Column2'] && emailRegex.test(item['Column2']) ? item['Column2'] : undefined  // Assume 'Column2' is the email
            };
          });

        resolve(data ?? []);
      } catch (error) {
        customAlert?.('fail', "Failed to parse file", `${error}`);
        resolve([]);
      }
    };

    if (file.type === 'application/json' || file.type === 'text/csv') {
      reader.readAsText(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      reader.readAsArrayBuffer(file);
    }
  });
};
