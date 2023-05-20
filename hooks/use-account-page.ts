import { useHookstate } from '@hookstate/core';
import { defaults } from 'pouchdb';
import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from 'react-query';
import { CachePrefixKeys, FETCH_POSTS_LIMIT } from '../constants';
import { AccountDto, PostViewByEnum } from '../dtos';
import { AccountRepo, PostRepo } from '../repos';
import { AppState, PostState } from '../store';
import { buildSortQuery, buildWhereQuery, useFollow, useInfiniteScroll, useIsAdmin } from './atoms';
import { useEditAvatar } from './use-edit-avatar';
import { useEditCoverImage } from './use-edit-cover-image';
import { useToast } from '@chakra-ui/react';
import { toastBaseConfig } from '../utils';

export const useAccountPage = ({ accountId }: { accountId?: string }) => {
  const postState = useHookstate(PostState);
  const appState = useHookstate(AppState);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { isAdmin } = useIsAdmin();
  const accountQuery = useQuery<AccountDto>(
    [CachePrefixKeys.ACCOUNT, accountId],
    () => AccountRepo.fetchAccount(accountId!),
    {
      enabled: !!accountId,
    }
  );
  const { avatarFileInputRef, avatarUpdating, openAvatarFileImport, handleAvatarFileImportChange } = useEditAvatar({
    accountId,
  });

  const { coverImageFileInputRef, coverImageUpdating, openCoverImageFileImport, handleCoverImageFileImportChange } =
    useEditCoverImage({ accountId });

  const {
    followState: { isHover, followed, isLoading: followIsLoading },
    followMethods: { mouseOver, mouseOut, followAccount, unFollowAccount },
  } = useFollow({ accountId });

  const bioInputRef = useRef<any>();

  const editBioMutation = useMutation(
    async () => {
      const value = bioInputRef.current.value?.trim();
      if (value) {
        await AccountRepo.setBio(value);
      } else {
        throw new Error('Bio must be not empty');
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT, accountId]);
        accountQuery.refetch();
        toast({
          title: 'Update bio successfully',
          status: 'success',
          ...toastBaseConfig,
        });
      },
      onError: () => {
        toast({
          title: 'Update bio failed',
          status: 'error',
          ...toastBaseConfig,
        });
      },
    }
  );

  const postFilter = { filter: { ...postState.value.filter, viewBy: PostViewByEnum.NEW } };
  switch (postState.value.filter.type) {
    case 'no-replies':
      postFilter.filter.type = { $ne: 'Reply' } as any;
      break;
    case 'media':
      postFilter.filter.type = undefined;
      postFilter.filter.media = { $ne: 'Standard' } as any;
    default:
      postFilter.filter.type = undefined;
  }

  const likedQuery = useQuery(['liked', accountId], () => PostRepo.fetchListLikedPosts(accountId!), {
    enabled: !!accountId,
  });

  const listPostsQuery = useInfiniteQuery(
    [CachePrefixKeys.LIST_ACCOUNT_POSTS, accountId, postFilter.filter],
    ({ pageParam }) => {
      const skip = pageParam?.skip || 0;
      return PostRepo.getListPosts({
        skip,
        limit: FETCH_POSTS_LIMIT,
        selector: buildWhereQuery({
          filter: { ...postFilter.filter, accountId },
        }),
        sort: buildSortQuery(postFilter),
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < FETCH_POSTS_LIMIT) return undefined;
        const skip = pages.length * FETCH_POSTS_LIMIT;
        return {
          skip,
        };
      },
      keepPreviousData: true,
      enabled: appState.value.ready,
    }
  );

  const {
    infiniteScrollState: { isFetchMoreData },
  } = useInfiniteScroll();
  useEffect(() => {
    if (isFetchMoreData && listPostsQuery.hasNextPage && !listPostsQuery.isFetchingNextPage) {
      listPostsQuery.fetchNextPage();
    }
  }, [isFetchMoreData]);

  return {
    accountPageState: {
      avatarFileInputRef,
      avatarUpdating,
      coverImageFileInputRef,
      coverImageUpdating,
      followed,
      isHover,
      followIsLoading,
      accountQuery,
      listPostsQuery,
      likedQuery,
      isAdmin,
    },
    accountPageMethods: {
      openAvatarFileImport,
      handleAvatarFileImportChange,
      openCoverImageFileImport,
      handleCoverImageFileImportChange,
      mouseOver,
      mouseOut,
      followAccount,
      unFollowAccount,
      bioInputRef,
      bioUpdating: editBioMutation.isLoading,
      handleUpdateBio: editBioMutation.mutateAsync,
    },
  };
};
