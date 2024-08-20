import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './FontUpload.css';
import { RefreshIcon } from '../Icons/RefreshIcon';
import { AddIcon } from '../Icons/AddIcon';

type Props = {
  fileResult: (file: File) => void;
  setFileAdded?: (added: boolean) => void;
  reset?: boolean;
  setReset?: (value: boolean) => void;
  removeThisFile?: () => void;
  required?: boolean;
}

export const FontUpload = ({ fileResult, setFileAdded, reset, setReset, removeThisFile, required }: Props) => {
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

  const validateFile = (file: File) => {
    const validExtensions = ['.woff'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    return validExtensions.includes(fileExtension);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const isValid = validateFile(file);

    setIsFileValid(isValid);

    if (isValid) {
      fileResult(file);
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
  }, [fileResult, setFileAdded]);

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeThisFile();
    setFileName(null);
    setIsFileValid(null);
    if (setFileAdded) {
      setFileAdded(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    onDragEnter: (event) => {
      const files = event.dataTransfer.items;
      if (files.length > 0) {
        const file = files[0].getAsFile();
        if (file) {
          setIsFileValid(validateFile(file));
        }
      }
    },
    onDragLeave: () => {
      setIsFileValid(null);
    },
    onDragOver: (event) => {
      event.preventDefault();
      const files = event.dataTransfer.items;
      if (files.length > 0) {
        const file = files[0].getAsFile();
        if (file) {
          setIsFileValid(validateFile(file));
        }
      }
    }
  });

  return (
    <div className={`fontupload-wrapper ${fileName ? 'file-active' : ''}`} {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={'fontupload__icon-wrapper ' + (fileName ? 'file-active' : isDragActive ? (isFileValid ? 'valid' : 'invalid') : 'normal')}>
        {!reset ? <RefreshIcon /> : <AddIcon />}
      </div>
      <h4 className='fontupload_title'>
        {fileName ? `${fileName}` : isDragActive ? (isFileValid ? 'Valid File' : 'Invalid File Format') : 'Add new File'}
      </h4>
      <p className='fontupload_section'>
        {fileName ? 'Change file' : isDragActive ? (isFileValid ? 'Drag & drop' : 'File should be .woff') : 'Drag & drop .woff'}
      </p>
      {fileName && (
        <button className="delete-btn" onClick={removeFile}>Undo</button>
      )}
    </div>
  );
};