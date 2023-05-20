import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { AccountRepo } from '../repos';
import { AccountState } from '../store';
import { useAccountList, useFriend, useInfiniteScroll, usePost } from './atoms';

export const useHomePage = () => {
  const accountState = useHookstate(AccountState);
  const {
    listPostsState: { listPostsQuery },
  } = usePost({
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
    if (isFetchMoreData && listPostsQuery.hasNextPage && !listPostsQuery.isFetchingNextPage) {
      listPostsQuery.fetchNextPage();
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
    homePageState: {
      listFriendsQuery,
      listPostsQuery,
      accountQuery,
      listAccountsQuery,
    },
  };
};
