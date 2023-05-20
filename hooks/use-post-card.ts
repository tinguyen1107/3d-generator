import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { AccountDto, PostDto, PostStatus } from '../dtos';
import { AccountRepo, PostRepo } from '../repos';
import { AccountState } from '../store';
import { useComment, useFollow, useIsAdmin, useRepost } from './atoms';
import { useBookmarkPost } from './atoms/use-bookmark';

export const usePostCard = ({
  postId,
  accountId,
  currentCommentPage,
  repostId,
  data,
  setData,
}: {
  postId: string;
  accountId?: string;
  currentCommentPage?: number;
  repostId?: string;
  data?: PostDto;
  setData?: (dto: PostDto) => void;
}) => {
  const accountState = useHookstate(AccountState);
  const postQuery = useQuery(['post', postId], () => PostRepo.fetchPost(postId), {
    enabled: !!postId,
  });

  const accountQuery = useQuery<AccountDto>(
    [CachePrefixKeys.ACCOUNT, data?.accountId],
    () => AccountRepo.fetchAccount(data!.accountId),
    {
      enabled: !!data?.accountId,
    }
  );
  const {
    bookmarkMethods: { addBookmark, removeBookmark },
    bookmarkState,
  } = useBookmarkPost(postId);

  const {
    followState,
    followMethods: { unFollowAccount, followAccount },
  } = useFollow({ accountId: data?.accountId ?? accountId ?? '' });

  const getCanRepostQuery = useQuery<boolean>(['can_repost', postId], () => PostRepo.canRepost(postId), {
    enabled: !!postId,
  });

  const getRepostCountQuery = useQuery<number>(['repost_count', postId], () => PostRepo.repostCount(postId), {
    enabled: !!postId,
  });

  const getQuotePostCountQuery = useQuery<number>(['quote_post_count', postId], () => PostRepo.quotePostCount(postId), {
    enabled: !!postId,
  });

  const {
    commentState: { getListCommentsQuery, getNumCommentsQuery },
  } = useComment(postId, currentCommentPage);

  const {
    repostState: { isLoading: repostLoading },
    repostMethods: { repost, undoRepost },
  } = useRepost(postId, repostId!);

  const getVoteQuery = useQuery<number>(['vote', postId], () => PostRepo.getVotePost(postId), {
    enabled: !!postId,
  });

  const getVoteStatusQuery = useQuery<any>(['vote_status', postId], () => PostRepo.voteStatusPost(postId), {
    enabled: !!postId && !!accountState.value.profile,
  });

  const parentPostQuery = useQuery(
    ['post', data?.postType.post_id],
    () => PostRepo.fetchPost(data?.postType.post_id!),
    {
      enabled: !!data && data.postType.type == 'Reply',
    }
  );

  const { isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data?.status !== PostStatus.DRAFT && data?.postType.type !== 'RePost') return;

    const interval = setInterval(async () => {
      const post = await PostRepo.fetchPostByDraftId(data!.id);

      if (post) {
        if (setData) {
          setData(post);
        }
        PostRepo.deletePost({ postId: data!.id }).catch(console.log);
        queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
        clearInterval(interval);
      }
    }, 3000);
  }, [data?.status]);

  return {
    postCardState: {
      followState,
      bookmarkState,
      postQuery,
      accountQuery,
      getListCommentsQuery,
      getNumCommentsQuery,
      getCanRepostQuery,
      getRepostCountQuery,
      getQuotePostCountQuery,
      repostLoading,
      getVoteQuery,
      getVoteStatusQuery,
      parentPostQuery,
      isAdmin,
    },
    postCardMethods: {
      addBookmark,
      removeBookmark,
      followAccount,
      unFollowAccount,
      repost,
      undoRepost,
    },
  };
};
