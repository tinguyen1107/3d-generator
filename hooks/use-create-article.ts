import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import Quill from 'quill';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AuthUtils, toastBaseConfig } from '../utils';
import { ArticleRepo } from '../repos';
import { useHookstate } from '@hookstate/core';
import { AccountState } from '../store';
import { PostCache } from '../cache';
import { CachePrefixKeys } from '../constants';
import { CreateArticleInput } from '../apis';

export const useCreateArticle = ({ afterSubmit }: { afterSubmit?: () => any } = {}) => {
  const queryClient = useQueryClient();
  const accountState = useHookstate(AccountState);
  const createArticleForm = useForm<CreateArticleInput>();
  const [createArticlePublishing, setCreateArticlePublishing] = useState(false);
  const refQuill = useRef<Quill>();
  const toast = useToast();
  const router = useRouter();

  const handleCreateArticleFormSubmit = useMemo(
    () =>
      createArticleForm.handleSubmit((data) => {
        AuthUtils.authCheckAndExec(async () => {
          setCreateArticlePublishing(true);

          try {
            await ArticleRepo.createArticle(data);

            await PostCache.cache();
            queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
            queryClient.invalidateQueries([CachePrefixKeys.LIST_ACCOUNT_POSTS, accountState.value.profile?.id]);

            createArticleForm.reset();
            createArticleForm.setValue('body', []);
            createArticleForm.trigger('body');
            if (afterSubmit) afterSubmit();

            router.replace('/blog');

            toast({
              title: `Create article successfully`,
              status: 'success',
              ...toastBaseConfig,
            });

            router.push('/blog/');
            // .finally(() => localStorage.removeItem(CREATE_POST_REDIRECT));
          } catch (error) {
            console.error(error);
            toast({
              title: `Create article failed`,
              status: 'error',
              ...toastBaseConfig,
            });
          } finally {
            setCreateArticlePublishing(false);
          }
        });
      }),
    []
  );

  return {
    refQuill,
    createArticleForm,
    createArticlePublishing,
    handleCreateArticleFormSubmit,
  };
};
