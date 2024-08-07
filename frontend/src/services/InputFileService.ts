import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Student } from '../util/types';

type TabularData = {
  [key: string]: string;
};

const requiredFields = ['Name', 'Email'];

export const parseCSV = (fileData: string, headers?: string[]): Promise<TabularData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileData, {
      header: !headers, 
      complete: (result) => {
        let data = result.data as TabularData[];
        if (headers) {
          data = data.map((row: any) => {
            const rowObj: TabularData = {};
            headers.forEach((header, index) => {
              rowObj[header] = row[index];
            });
            return rowObj;
          });
        }
        resolve(data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

export const parseExcel = (fileData: ArrayBuffer, headers?: string[]): TabularData[] => {
  const workbook = XLSX.read(fileData, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  let worksheet = XLSX.utils.sheet_to_json<TabularData>(workbook.Sheets[sheetName], { header: 1 });

  if (headers) {
    worksheet = worksheet.slice(1).map(data => {
      const rowObj: TabularData = {};
      headers.forEach((header, index) => {
        rowObj[header] = data[index];
      });
      return rowObj;
    });
  }
  return worksheet;
};

export const parseJSON = (fileData: string): TabularData[] => {
  return JSON.parse(fileData) as TabularData[];
};

export const ParseFileData = async (file: File, headers?: string[]): Promise<Student[]> => {
  if (!file) return [];

  return new Promise<Student[]>((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const fileData = e.target!.result as string;
      try {
        let parsedData: TabularData[] = [];
        if (file.type === 'text/csv') {
          parsedData = await parseCSV(fileData, headers);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          parsedData = parseExcel(e.target!.result as ArrayBuffer, headers);
        } else if (file.type === 'application/json') {
          parsedData = parseJSON(fileData);
        } else {
          alert('Unsupported file format');
          resolve([]);
          return;
        }

        // Check if required fields are present
        if (!headers && parsedData.length > 0) {
          const sampleRow = parsedData[0];
          const missingFields = requiredFields.filter(field => !(field in sampleRow));
          if (missingFields.length > 0) {
            alert(`Missing required fields: ${missingFields.join(', ')}`);
            resolve([]);
            return;
          }
        }

        const emailRegex = new RegExp("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}$");
        const data: Student[] = parsedData
          .filter(item => item.Name)
          .map(item => {
            if (item.Email && emailRegex.test(item.Email)) {
              return { name: item.Name, email: item.Email };
            } else {
              return { name: item.Name, email: undefined };
            }
          });

        resolve(data ?? []);
      } catch (error) {
        console.log("Failed to parse file", error);
        resolve([]);
      }
    };

    reader.onerror = () => {
      console.log("File reading error");
      resolve([]);
    };

    if (file.type === 'application/json' || file.type === 'text/csv') {
      reader.readAsText(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      reader.readAsArrayBuffer(file);
    }
  });
};
