import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Quill from 'quill';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { toastBaseConfig } from '../utils';
import { FeedbackInput } from '../apis/report.api';
import { ReportRepo } from '../repos/report.repo';

export const useSupport = ({ afterSubmit }: { afterSubmit?: () => any } = {}) => {
  const createSupportForm = useForm<FeedbackInput>();
  const [createSupportPublishing, setCreateSupportPublishing] = useState(false);
  const refQuill = useRef<Quill>();
  const toast = useToast();
  const router = useRouter();

  const handleCreateSupportFormSubmit = useMemo(
    () =>
      createSupportForm.handleSubmit(async (data) => {
        setCreateSupportPublishing(true);

        try {
          await ReportRepo.feedback(data);
          createSupportForm.reset();
          toast({
            title: `Sent feedback`,
            status: 'success',
            ...toastBaseConfig,
          });
        } catch (err) {
          console.error(err);
          toast({
            title: `Sending feedback failed`,
            status: 'error',
            ...toastBaseConfig,
          });
        } finally {
          setCreateSupportPublishing(false);
        }
      }),
    // createArticleForm.handleSubmit((data) => {
    //   AuthUtils.authCheckAndExec(async () => {
    //     setCreateArticlePublishing(true);
    //
    //     try {
    //       await ArticleRepo.createArticle(data);
    //
    //       await PostCache.cache();
    //       queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
    //       queryClient.invalidateQueries([CachePrefixKeys.LIST_ACCOUNT_POSTS, accountState.value.profile?.id]);
    //
    //       createArticleForm.reset();
    //       createArticleForm.setValue('body', []);
    //       createArticleForm.trigger('body');
    //       if (afterSubmit) afterSubmit();
    //
    //       router.replace('/blog');
    //
    //       toast({
    //         title: `Create article successfully`,
    //         status: 'success',
    //         ...toastBaseConfig,
    //       });
    //
    //       router.push('/blog/');
    //       // .finally(() => localStorage.removeItem(CREATE_POST_REDIRECT));
    //     } catch (error) {
    //       console.error(error);
    //       toast({
    //         title: `Create article failed`,
    //         status: 'error',
    //         ...toastBaseConfig,
    //       });
    //     } finally {
    //       setCreateArticlePublishing(false);
    //     }
    //   });
    // }),
    []
  );

  return {
    refQuill,
    createSupportForm,
    createSupportPublishing,
    handleCreateSupportFormSubmit,
  };
};
