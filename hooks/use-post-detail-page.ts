import { useHookstate } from '@hookstate/core';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { getContainer } from '../core';
import { PostViewByEnum } from '../dtos';
import { AccountRepo, PostRepo } from '../repos';
import { AccountState, AppState, PostState } from '../store';
import { buildSortQuery, buildWhereQuery, useIsAdmin } from './atoms';

const FETCH_COMMENT_LIMIT = 5;
export const usePostDetaiPage = ({
  currentCommentPage,
  postId,
  ownerId,
  communityId,
  repTypeQuery,
}: {
  currentCommentPage: number;
  postId?: string;
  ownerId?: string;
  communityId?: string;
  repTypeQuery?: string;
}) => {
  const accountState = useHookstate(AccountState);
  const queryClient = useQueryClient();
  const appState = useHookstate(AppState);
  const postState = useHookstate(PostState);

  const { isAdmin } = useIsAdmin();
  const accountQuery = useQuery([CachePrefixKeys.ACCOUNT, ownerId], () => AccountRepo.fetchAccount(ownerId!), {
    enabled: !!ownerId,
  });

  const postFilter: PostState = {
    filter: {
      ...postState.value.filter,
      type: repTypeQuery ?? 'Reply',
      typeValue: postId,
      viewBy: PostViewByEnum.NEW,
    },
  };

  const getListCommentsQuery = useInfiniteQuery(
    ['list_comments', postId, currentCommentPage],
    ({ pageParam }) =>
      PostRepo.getListPosts({
        skip: pageParam?.skip || 0,
        limit: FETCH_COMMENT_LIMIT,
        selector: buildWhereQuery(postFilter, true),
        sort: buildSortQuery(postFilter),
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < FETCH_COMMENT_LIMIT) return undefined;
        const skip = pages.length * FETCH_COMMENT_LIMIT;
        return {
          skip,
        };
      },
      keepPreviousData: true,
      enabled: appState.value.ready,
    }
  );

  const postQuery = useQuery(['post', postId], () => PostRepo.fetchPost(postId!), {
    enabled: !!postId,
  });

  const { data } = postQuery;

  const getNumCommentsQuery = useQuery<number>(
    ['num_comments', data?.id],
    () => PostRepo.fetchPostNumComments(data!.id),
    {
      enabled: !!data?.id,
    }
  );

  const getVoteQuery = useQuery<number>(['vote', postId], () => PostRepo.getVotePost(postId!), {
    enabled: !!postId,
  });

  const deletePostMutation = useMutation(() => PostRepo.deletePost({ postId, postOwner: ownerId, communityId }));

  const deletePost = useCallback(async () => {
    await deletePostMutation.mutateAsync();
    queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
    queryClient.invalidateQueries([
      CachePrefixKeys.LIST_ACCOUNT_POSTS,
      getContainer().bcConnector.wallet.getAccountId(),
    ]);

    if (communityId) {
      queryClient.invalidateQueries(['list_community_posts', communityId]);
    }
  }, [postId]);

  return {
    postDetailPageState: {
      isAdmin,
      accountQuery,
      postQuery,
      getNumCommentsQuery,
      getListCommentsQuery,
      getVoteQuery,
      deletePostLoading: deletePostMutation.isLoading,
    },
    postDetailMethods: {
      deletePost,
    },
  };
};
