import { useToast } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { CachePrefixKeys, FILE_LIMIT_SIZE } from '../constants';
import { AccountRepo } from '../repos';
import { IPFSUtils, toastBaseConfig } from '../utils';

export const useEditAvatar = ({ accountId }: { accountId?: string }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const avatarFileInputRef = React.useRef<any>();

  const useEditAvatar = useMutation(
    async () => {
      if (avatarFileInputRef.current?.files) {
        const file = avatarFileInputRef.current.files[0];
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
              return AccountRepo.setAvatar(url);
            },
          });
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT, accountId]);
      },
    }
  );

  const openAvatarFileImport = useCallback(async () => {
    avatarFileInputRef.current?.click();
  }, []);

  const handleAvatarFileImportChange = useCallback(async () => {
    useEditAvatar.mutate();
  }, [accountId]);

  return {
    avatarFileInputRef,
    avatarUpdating: useEditAvatar.isLoading,
    openAvatarFileImport,
    handleAvatarFileImportChange,
  };
};
