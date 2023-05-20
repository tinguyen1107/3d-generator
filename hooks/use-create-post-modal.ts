import { useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { IPFSUtils, ModalUtils } from '../utils';
import { useCreatePost } from '../hooks';
import { useMutation, useQuery } from 'react-query';
import { AccountDto, PostType } from '../dtos';
import { useHookstate } from '@hookstate/core';
import { AccountState } from '../store';
import { AccountRepo } from '../repos';
import { CachePrefixKeys } from '../constants';

export const useCreatePostModal = () => {
  const accountState = useHookstate(AccountState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { createPostForm, refQuill, createPostPublishing, handleCreatePostFormSubmit } = useCreatePost();

  const accountQuery = useQuery<AccountDto>(
    [CachePrefixKeys.ACCOUNT, accountState.value.profile?.id],
    () => AccountRepo.fetchAccount(accountState.value.profile?.id!),
    { enabled: !!accountState.value.profile?.id }
  );

  const fileInputRef = React.useRef<any>();

  const uploadFileMutation = useMutation(async () => {
    if (fileInputRef.current?.files) {
      const file = fileInputRef.current.files[0];
      await IPFSUtils.uploadFileToIPFS({
        file,
        onSuccess: async (url) => {
          return createPostForm.setValue('postTypeValue', url);
        },
      });
    }
  });

  const handleOpen = useCallback((type?: PostType) => {
    if (!!type && type.type == 'QuotePost') {
      createPostForm.setValue('postType', 'QuotePost');
      if (!!type.post_id) {
        createPostForm.setValue('postTypeValue', type.post_id);
      }
      createPostForm.trigger('postType');
    } else {
      createPostForm.setValue('postType', 'Standard');
      createPostForm.trigger('postType');
    }
    onOpen();
  }, []);

  useEffect(() => {
    ModalUtils.createPost.onOpen = handleOpen;
    ModalUtils.createPost.onClose = onClose;
  }, []);

  return {
    createPostModalState: {
      isOpen,
      accountQuery,
      fileInputRef,
      refQuill,
      createPostForm,
    },
    createPostModalMethods: {
      onOpen: handleOpen,
      onClose,
      createPostPublishing,
      handleCreatePostFormSubmit,
      uploadFileMutation,
    },
  };
};
