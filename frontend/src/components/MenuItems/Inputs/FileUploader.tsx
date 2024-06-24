import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUploader.css';
import { AddIcon } from '../Icons/AddIcon';

type Props = {
  FileHandler: (file: File) => void
}

export const FileUpload = ({ FileHandler }: Props) => {
  const [isFileValid, setIsFileValid] = useState<boolean | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    FileHandler(acceptedFiles[0]);
    setIsFileValid(null); 
  }, [FileHandler]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json']
    },
    multiple: false,
    onDragEnter: (event) => {
      const files = event.dataTransfer.items;
      if (files.length > 0) {
        const fileType = files[0].type;
        setIsFileValid(['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json'].includes(fileType));
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
        setIsFileValid(['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json'].includes(fileType));
      }
    }
  });

  return (
    <div className="fileupload-wrapper" {...getRootProps()}>
      <input {...getInputProps()} />
      <>
        <div className={'fileupload__icon-wrapper ' + (isDragActive ? (isFileValid ? 'valid' : 'invalid') : 'normal')}>
          <AddIcon />
        </div>
        <h4 className='fileupload_title'>
          {isDragActive ? (isFileValid ? 'Valid File' : 'Invalid File Format') : 'Add new File'}
        </h4>
        <p className='fileupload_section'>
          {isDragActive ? (isFileValid ? 'Drag & drop' : 'File should be .csv, .xlsx or .json') : 'Drag & drop'}
        </p>
      </>
    </div>
  );
};
