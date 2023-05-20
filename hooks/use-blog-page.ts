import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { AccountRepo } from '../repos';
import { AccountState } from '../store';
import { useAccountList, useFriend, useInfiniteScroll, useBlog } from './atoms';

export const useBlogPage = () => {
  const accountState = useHookstate(AccountState);
  const {
    listPostsState: { listPostsQuery: listBlogsQuery },
  } = useBlog({
    filter: {
      type: { $ne: 'no-replies' } as any,
    },
  });
  const {
    friendState: { listFriendsQuery },
  } = useFriend();
  const {
    accountListState: { listAccountsQuery },
  } = useAccountList();

  const {
    infiniteScrollState: { isFetchMoreData },
  } = useInfiniteScroll();
  useEffect(() => {
    if (isFetchMoreData && listBlogsQuery.hasNextPage && !listBlogsQuery.isFetchingNextPage) {
      listBlogsQuery.fetchNextPage();
    }
  }, [isFetchMoreData]);

  const accountQuery = useQuery(
    [CachePrefixKeys.ACCOUNT, accountState.value.profile?.id],
    () => AccountRepo.fetchAccount(accountState.value.profile?.id!),
    {
      enabled: !!accountState.value.profile?.id,
    }
  );

  return {
    blogPageState: {
      listFriendsQuery,
      listBlogsQuery,
      accountQuery,
      listAccountsQuery,
    },
  };
};
