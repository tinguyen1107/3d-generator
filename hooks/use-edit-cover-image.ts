import { useToast } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { CachePrefixKeys, FILE_LIMIT_SIZE } from '../constants';
import { AccountRepo } from '../repos';
import { IPFSUtils, toastBaseConfig } from '../utils';

export const useEditCoverImage = ({ accountId }: { accountId?: string }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const coverImageFileInputRef = React.useRef<any>();

  const useEditCoverImage = useMutation(
    async () => {
      if (coverImageFileInputRef.current?.files) {
        const file = coverImageFileInputRef.current.files[0];
        if (file.size > FILE_LIMIT_SIZE) {
          toast({
            title: 'Exceed file size limitation',
            status: 'error',
            ...toastBaseConfig,
          });
        } else {
          await IPFSUtils.uploadFileToIPFS({
            file,
            onSuccess: async (url) => {
              return AccountRepo.setThumbnail(url);
            },
          });
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT]);
      },
    }
  );

  const openCoverImageFileImport = useCallback(async () => {
    coverImageFileInputRef.current?.click();
  }, []);

  const handleCoverImageFileImportChange = useCallback(async () => {
    useEditCoverImage.mutate();
  }, [accountId]);

  return {
    coverImageFileInputRef,
    coverImageUpdating: useEditCoverImage.isLoading,
    openCoverImageFileImport,
    handleCoverImageFileImportChange,
  };
};
