import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './PdfFileUpload.css';
import { RefreshIcon } from '../Icons/RefreshIcon';
import { AddIcon } from '../Icons/AddIcon';
import { PDFDocument } from 'pdf-lib';

type Props = {
  returnPdf: (base64Pdf: string) => void;
  setFileAdded?: (added: boolean) => void;
  reset?: boolean;
  setReset?: (value: boolean) => void;
}

export const PdfFileUpload = ({ returnPdf, setFileAdded, reset, setReset }: Props) => {
  const [isFileValid, setIsFileValid] = useState<boolean | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (reset) {
      setIsFileValid(null);
      setFileName(null);
      if (setReset) {
        setReset(false);
      }
    }
  }, [reset, setReset]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const isValid = file.type === 'application/pdf';
  
    setIsFileValid(isValid);
  
    if (isValid) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
  
      const finalFile = await PDFDocument.create();
      const [firstPage] = await finalFile.copyPages(pdfDoc, [0]);
      finalFile.addPage(firstPage);
  
      const base64Pdf = await finalFile.saveAsBase64({ dataUri: true });
  
      returnPdf(base64Pdf);
      setFileName(file.name);
      if (setFileAdded) {
        setFileAdded(true);
      }
    } else {
      setFileName(null);
      if (setFileAdded) {
        setFileAdded(false);
      }
    }
  }, [returnPdf, setFileAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: (event) => {
      const files = event.dataTransfer.items;
      if (files.length > 0) {
        const fileType = files[0].type;
        setIsFileValid(fileType === 'application/pdf');
      }
    },
    onDragLeave: () => {
      setIsFileValid(null);
    },
    onDragOver: (event) => {
      event.preventDefault();
      const files = event.dataTransfer.items;
      if (files.length > 0) {
        const fileType = files[0].type;
        setIsFileValid(fileType === 'application/pdf');
      }
    }
  });

  return (
    <div className={`fileupload-wrapper ${fileName ? 'file-active' : ''}`} {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={'fileupload__icon-wrapper ' + (fileName ? 'file-active' : isDragActive ? (isFileValid ? 'valid' : 'invalid') : 'normal')}>
        {!reset ? <RefreshIcon /> : <AddIcon />}
      </div>
      <h4 className='fileupload_title'>
        {fileName ? `${fileName}` : isDragActive ? (isFileValid ? 'Valid File' : 'Invalid File Format') : 'Add new PDF'}
      </h4>
      <p className='fileupload_section'>
        {fileName ? 'Change file' : isDragActive ? (isFileValid ? 'Drag & drop' : 'File should be .pdf') : 'Drag & drop .pdf'}
      </p>
    </div>
  );
};