import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './PdfFileUpload.css';

type Props = {
  fileResult: (file: File) => void
}

export const PdfFileUpload = ({ fileResult }: Props) => {
  const [isFileValid, setIsFileValid] = useState<boolean | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    fileResult(acceptedFiles[0]);
    setIsFileValid(null); // Reset the state after file is dropped
  }, [fileResult]);

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
    <div className="fileupload-wrapper" {...getRootProps()}>
      <input {...getInputProps()} />
        <>
          <div className={'fileupload__icon-wrapper ' + (isDragActive ? (isFileValid ? 'valid' : 'invalid') : 'normal')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
              <path d="M4 12H20M12 4V20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
            </svg>
          </div>
          <h4 className='fileupload_title'>
            {isDragActive ? (isFileValid ? 'Valid File' : 'Invalid File Format') : 'Add new PDF'}
          </h4>
          <p className='fileupload_section'>
            {isDragActive ? (isFileValid ? 'Drag & drop' : 'File should be .pdf') : 'Drag & drop'}
          </p>
        </>
    </div>
  );
};
