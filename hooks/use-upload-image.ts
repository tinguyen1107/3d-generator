import React, { useCallback } from 'react';
import { useMutation } from 'react-query';
import { IPFSUtils } from '../utils';

export const useUploadImage = () => {
  const fileInputRef = React.useRef<any>();
  const urlInputRef = React.useRef<any>();

  const useEditImage = useMutation(async () => {
    if (fileInputRef.current?.files) {
      const file = fileInputRef.current.files[0];
      await IPFSUtils.uploadFileToIPFS({
        file,
        onSuccess: async (url) => {
          console.log('tinguyen url', url);
          urlInputRef.current.value = url;
        },
      });
    }
  });

  const openFileImport = useCallback(async () => {
    fileInputRef.current?.click();
  }, []);

  const handleFileImportChange = useCallback(async () => {
    useEditImage.mutate();
  }, []);

  return {
    fileInputRef,
    urlInputRef,
    imageUploading: useEditImage.isLoading,
    openFileImport,
    handleFileImportChange,
  };
};
