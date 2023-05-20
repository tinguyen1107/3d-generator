import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import Quill from 'quill';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AuthUtils, ModalUtils, toastBaseConfig } from '../utils';
import { ChestApi, CreatePostInput } from '../apis';
import { PostRepo } from '../repos';
import { useHookstate } from '@hookstate/core';
import { AccountState } from '../store';
import { PostCache } from '../cache';
import { CachePrefixKeys } from '../constants';
import { getContainer } from '../core';

export const useCreatePost = ({ afterSubmit }: { afterSubmit?: () => any } = {}) => {
  const queryClient = useQueryClient();
  const accountState = useHookstate(AccountState);
  const createPostForm = useForm<CreatePostInput>();
  const [createPostPublishing, setCreatePostPublishing] = useState(false);
  const refQuill = useRef<Quill>();
  const toast = useToast();
  const router = useRouter();

  const handleCreatePostFormSubmit = useMemo(
    () =>
      createPostForm.handleSubmit((data) =>
        AuthUtils.authCheckAndExec(async () => {
          setCreatePostPublishing(true);

          let action;

          if (data.arMode) {
            action = 'Create AR message';
          } else {
            action = 'Create post';
            if (data.media == 'Gif') data.media = 'Image';
          }

          const createPostRedirect = data.arMode
            ? '/home/'
            : `/account/${getContainer().bcConnector.wallet.getAccountId()}`;
          console.log(action, 'with: ', data);

          try {
            data.arMode
              ? await ChestApi.placeMessageChest({
                  name: data.name,
                  code: data.code,
                  message: data.title,
                  location: data.location,
                  action: 'place',
                  expired_at: data.expired,
                  chestType:
                    data.media == 'Image'
                      ? 'Image'
                      : data.media == 'Video'
                      ? 'Video'
                      : data.media == 'Gif'
                      ? 'Gif'
                      : 'Standard',
                  chestTypeValue: data.mediaValue,
                })
              : await PostRepo.createPost(data);

            await PostCache.cache();
            queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
            queryClient.invalidateQueries([CachePrefixKeys.LIST_ACCOUNT_POSTS, accountState.value.profile?.id]);
            queryClient.invalidateQueries(['list_comments', data.postTypeValue, 1]);
            if (!data.arMode && data.postType == 'QuotePost') {
              queryClient.invalidateQueries(['quote_post_count', data.postTypeValue]);
            }

            ModalUtils.createPost.onOpen();
            createPostForm.reset({
              title: '',
              postType: 'Standard',
              media: 'Standard',
            });

            toast({
              title: `${action} successfully`,
              status: 'success',
              ...toastBaseConfig,
            });

            if (afterSubmit) afterSubmit();
            ModalUtils.createPost.onClose();

            // if (data.postType != 'Reply' && data.postType != 'ArticleComment') router.push(createPostRedirect);
            // .finally(() => localStorage.removeItem(CREATE_POST_REDIRECT));
          } catch (error) {
            console.error(error);
            toast({
              title: `${action} failed`,
              status: 'error',
              ...toastBaseConfig,
            });
          } finally {
            setCreatePostPublishing(false);
          }
        })
      ),
    []
  );

  return {
    refQuill,
    createPostForm,
    createPostPublishing,
    handleCreatePostFormSubmit,
  };
};
