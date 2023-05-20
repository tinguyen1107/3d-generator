import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHookstate } from '@hookstate/core';
import { PostState } from '../../store';
import { PostRepo } from '../../repos';
import { CachePrefixKeys } from '../../constants';
import { RePostCache } from '../../cache';
import { getContainer } from '../../core';

export const useRepost = (postId: string, repostId: string) => {
  const postState = useHookstate(PostState);
  const queryClient = useQueryClient();
  const toast = useToast();

  const repostMutation = useMutation(() => {
    const tasks: string[] = Array.from(RePostCache.keys());

    if (tasks.indexOf(postId) === -1) {
      RePostCache.set(postId, true);
      return PostRepo.repost(postId, () => {
        queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS, postState.value.filter.viewBy]);
        queryClient.invalidateQueries([
          CachePrefixKeys.LIST_ACCOUNT_POSTS,
          getContainer().bcConnector.wallet.getAccountId(),
        ]);
        queryClient.invalidateQueries(['can_repost', postId]);
        queryClient.invalidateQueries(['repost_count', postId]);
      })
        .then(async () => {
          toast({
            title: 'ReRep successfully',
            status: 'success',
            duration: 1500,
            isClosable: true,
            position: 'bottom-left',
          });
        })
        .catch(() => {
          toast({
            title: 'ReRep failed',
            status: 'error',
            duration: 1500,
            isClosable: true,
            position: 'bottom-left',
          });
        });
    } else {
      toast({
        title: 'Another process is running, please wait',
        position: 'top',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
      return Promise.resolve();
    }
  });

  const undoRepostMutation = useMutation(async () => {
    const tasks: string[] = Array.from(RePostCache.keys());
    if (tasks.indexOf(postId) === -1) {
      if (!repostId) {
        repostId = await PostRepo.getRepostId(postId);
      }
      RePostCache.set(postId, false);
      return PostRepo.undoRepost(repostId, postId, () => {
        queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS, postState.value.filter.viewBy]);
        queryClient.invalidateQueries([
          CachePrefixKeys.LIST_ACCOUNT_POSTS,
          getContainer().bcConnector.wallet.getAccountId(),
        ]);
        queryClient.invalidateQueries(['can_repost', postId]);
        queryClient.invalidateQueries(['repost_count', postId]);
      })
        .then(async () => {
          toast({
            title: 'UnReRep successfully',
            status: 'success',
            duration: 1500,
            isClosable: true,
            position: 'bottom-left',
          });
        })
        .catch((e) => {
          console.log(e);
          toast({
            title: 'UnReRep failed',
            status: 'error',
            duration: 1500,
            isClosable: true,
            position: 'bottom-left',
          });
        });
    } else {
      toast({
        title: 'Another process is running, please wait',
        position: 'top',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });
      return Promise.resolve();
    }
  });

  const repost = useCallback(async () => {
    repostMutation.mutate();
  }, [postId]);

  const undoRepost = useCallback(async () => {
    console.log('UndoRepostMutation execute');
    undoRepostMutation.mutate();
  }, [postId]);

  return {
    repostState: {
      isLoading: repostMutation.isLoading || undoRepostMutation.isLoading,
    },
    repostMethods: {
      repost,
      undoRepost,
    },
  };
};
