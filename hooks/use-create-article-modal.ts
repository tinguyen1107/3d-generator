import { useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';
import { IPFSUtils, ModalUtils } from '../utils';
import { useCreateArticle } from '../hooks';
import { useMutation, useQuery } from 'react-query';
import { AccountDto } from '../dtos';
import { useHookstate } from '@hookstate/core';
import { AccountState } from '../store';
import { AccountRepo, CategoryRepo } from '../repos';
import { CachePrefixKeys } from '../constants';

export const useCreateArticleModal = () => {
  const accountState = useHookstate(AccountState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { createArticleForm, refQuill, createArticlePublishing, handleCreateArticleFormSubmit } = useCreateArticle();

  const accountQuery = useQuery<AccountDto>(
    [CachePrefixKeys.ACCOUNT, accountState.value.profile?.id],
    () => AccountRepo.fetchAccount(accountState.value.profile?.id!),
    { enabled: !!accountState.value.profile?.id }
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const uploadFileMutation = useMutation(async (file: File) => {
    await IPFSUtils.uploadFileToIPFS({
      file,
      onSuccess: async (url) => {
        return createArticleForm.setValue('featuredImage', url);
      },
    });
    // console.log('uploadFileMutation', file);
    // if (fileInputRef.current?.files) {
    //   const file = fileInputRef.current.files[0];
    //   await IPFSUtils.uploadFileToIPFS({
    //     file,
    //     onSuccess: async (url) => {
    //       return createArticleForm.setValue('featuredImage', url);
    //     },
    //   });
    // }
  });

  // TODO: fetch categories
  const categoriesQuery = useQuery([CachePrefixKeys.CATEGORY], () => CategoryRepo.getCategories());
  const categories = useMemo(() => {
    console.log('data', categoriesQuery.data);
    if (categoriesQuery.data?.length) return categoriesQuery.data;
    else return [];
  }, [categoriesQuery.data?.length]);

  // TODO: fetch tags
  const tagsQuery = useQuery([CachePrefixKeys.CATEGORY], () => { });

  useEffect(() => {
    ModalUtils.createArticle.onOpen = onOpen;
    ModalUtils.createArticle.onClose = onClose;
  }, []);

  const mediaConfig = useMemo(() => {
    const onChangeMedia = async (file: File, _: string) => {
      try {
        const url = await IPFSUtils.uploadFileToIPFS({ file });
        return { url };
      } catch (e) {
        console.error('Failed upload image to ipfs');
        throw e;
      }
    };

    return {
      imageProps: {
        onChange: (file: File) => onChangeMedia(file, 'image'),
        accept: 'image/*',
      },
      // videoProps: {
      //   onChange: (file: File) => onChangeMedia(file, 'video'),
      // },
    };
  }, []);

  return {
    createArticleModalState: {
      isOpen,
      mediaConfig,
      accountQuery,
      tagsQuery,
      categories,
      fileInputRef,
      refQuill,
      createArticleForm,
    },
    createArticleModalMethods: {
      onOpen,
      onClose,
      createArticlePublishing,
      handleCreateArticleFormSubmit,
      uploadFileMutation,
    },
  };
};
