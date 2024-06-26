import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './PdfFileUpload.css';
import { RefreshIcon } from '../Icons/RefreshIcon';
import { AddIcon } from '../Icons/AddIcon';

type Props = {
  fileResult: (file: File) => void
  setFileAdded?: (added: boolean) => void
  fileAdded?: boolean
}

export const PdfFileUpload = ({ fileResult, setFileAdded, fileAdded }: Props) => {
  const [isFileValid, setIsFileValid] = useState<boolean | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const isValid = file.type === 'application/pdf';

    setIsFileValid(isValid);

    if (isValid) {
      fileResult(file);
      if (setFileAdded) {
        setFileAdded(true);
      }
    } else {
      if (setFileAdded) {
        setFileAdded(false);
      }
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
      <div className={'fileupload__icon-wrapper ' + (fileAdded ? ' fileadded' : isDragActive ? (isFileValid ? 'valid ' : 'invalid ') : 'normal ')}>
        {fileAdded ? 
          <RefreshIcon />
        : 
          <AddIcon />
        }
      </div>
      <h4 className='fileupload_title'>
        {isDragActive ? (isFileValid ? 'Valid File' : 'Invalid File Format') : (fileAdded ? 'Change existing PDF' : 'Add new PDF')}
      </h4>
      <p className='fileupload_section'>
        {isDragActive ? (isFileValid ? ('Drag & drop') : ('File should be .pdf')) : (fileAdded ? 'Drag & drop' : 'Drag & drop')}
      </p>
    </div>
  );
};
