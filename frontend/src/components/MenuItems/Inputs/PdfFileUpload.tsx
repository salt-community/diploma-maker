import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './PdfFileUpload.css';

type Props = {
  fileResult: (file: File) => void
  setFileAdded?: (added: boolean) => void
  fileAdded?: boolean
}

export const PdfFileUpload = ({ fileResult, setFileAdded, fileAdded }: Props) => {
  const [isFileValid, setIsFileValid] = useState<boolean | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    fileResult(acceptedFiles[0]);
    setIsFileValid(null); 
    if (setFileAdded) {
      setFileAdded(true);
    }
  }, [fileResult, setFileAdded]);

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
          <div className={'fileupload__icon-wrapper ' + (isDragActive ? (isFileValid ? 'valid ' : 'invalid ') : 'normal ') + (fileAdded && ' fileadded')}>
            {fileAdded ? 
              <svg fill="#FFFFFFDF" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                <path d="M23,12A11,11,0,1,1,12,1a10.9,10.9,0,0,1,5.882,1.7l1.411-1.411A1,1,0,0,1,21,2V6a1,1,0,0,1-1,1H16a1,1,0,0,1-.707-1.707L16.42,4.166A8.9,8.9,0,0,0,12,3a9,9,0,1,0,9,9,1,1,0,0,1,2,0Z"></path></g>
              </svg>
            : 
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                <path d="M4 12H20M12 4V20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
              </svg>
            }
          </div>
          <h4 className='fileupload_title'>
            {isDragActive ? (isFileValid ? 'Valid File' : 'Invalid File Format') : (fileAdded ? 'Change existing PDF' : 'Add new PDF')}
          </h4>
          <p className='fileupload_section'>
          {isDragActive ? (isFileValid ? ('Drag & drop') : ('File should be .pdf')) : (fileAdded ? 'Drag & drop' : 'Drag & drop')}
          </p>
        </>
    </div>
  );
};
