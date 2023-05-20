import { useToast } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toastBaseConfig } from '../../utils';
import { useHookstate } from '@hookstate/core';
import { AccountState } from '../../store';
import { PostRepo } from '../../repos';
import { CachePrefixKeys, FETCH_POSTS_LIMIT } from '../../constants';

export const useBookmarkPost = (postId?: string) => {
  const accountState = useHookstate(AccountState);
  const queryClient = useQueryClient();
  const toast = useToast();

  const listPostsQuery = useQuery(
    [CachePrefixKeys.ACCOUNT_BOOKMARKS, accountState.value.profile?.id],
    ({ pageParam }) => {
      const offset = pageParam?.offset || 0;
      if (!accountState.value.profile?.id) return;
      return PostRepo.fetchBookmarks(accountState.value.profile?.id, {
        offset,
        limit: FETCH_POSTS_LIMIT,
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage?.length ?? 0 < FETCH_POSTS_LIMIT) return undefined;
        const offset = pages.length * FETCH_POSTS_LIMIT;
        return {
          offset,
        };
      },
      keepPreviousData: true,
      enabled: !!accountState.value.profile?.id,
    }
  );

  const accountBookmarksQuery = useQuery(
    [CachePrefixKeys.ACCOUNT_BOOKMARKS, accountState.value.profile?.id],
    () => PostRepo.fetchBookmarks(accountState.value.profile?.id!, {}),
    {
      enabled: !!accountState.value.profile?.id,
      retry: 0,
    }
  );

  const addBookmarkMutation = useMutation(() => PostRepo.addBookmark(postId!), {
    onSuccess: () => {
      toast({
        title: 'Add bookmark successfully',
        status: 'success',
        ...toastBaseConfig,
      });
      queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT_BOOKMARKS, accountState.value.profile?.id]);
      queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
      accountBookmarksQuery.refetch();
      listPostsQuery.refetch();
    },
    onError: () => {
      toast({
        title: 'Add bookmark failed',
        status: 'error',
        ...toastBaseConfig,
      });
    },
  });

  const removeBookmarkMutation = useMutation(() => PostRepo.removeBookmark(postId!), {
    onSuccess: () => {
      toast({
        title: 'Remove bookmark successfully',
        status: 'success',
        ...toastBaseConfig,
      });
      queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT_BOOKMARKS, accountState.value.profile?.id]);
      queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
      accountBookmarksQuery.refetch();
      listPostsQuery.refetch();
    },
    onError: () => {
      toast({
        title: 'Remove bookmark failed',
        status: 'error',
        ...toastBaseConfig,
      });
    },
  });

  const addBookmark = useCallback(async () => {
    addBookmarkMutation.mutate();
  }, [postId]);

  const removeBookmark = useCallback(async () => {
    removeBookmarkMutation.mutate();
  }, [postId]);

  const marked = React.useMemo(() => {
    return !!accountBookmarksQuery.data && !!accountBookmarksQuery.data?.find((item: any) => item.id === postId);
  }, [postId, accountBookmarksQuery.data?.length]);

  return {
    bookmarkState: {
      marked,
      isLoading:
        accountBookmarksQuery.isLoading ||
        addBookmarkMutation.isLoading ||
        removeBookmarkMutation.isLoading ||
        listPostsQuery.isLoading,
      listPostsQuery,
    },
    bookmarkMethods: {
      addBookmark,
      removeBookmark,
    },
  };
};
