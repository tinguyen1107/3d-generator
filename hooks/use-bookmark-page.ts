import { useHookstate } from '@hookstate/core';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { AccountRepo } from '../repos';
import { AccountState } from '../store';
import { useAccountList, useBookmarkPost, useComment, useFriend, usePost } from './atoms';

export const useBookmarkPage = () => {
  const accountState = useHookstate(AccountState);
  const {
    bookmarkState: { listPostsQuery },
  } = useBookmarkPost();
  const {
    friendState: { listFriendsQuery },
  } = useFriend();
  const {
    accountListState: { listAccountsQuery },
  } = useAccountList();

  const accountQuery = useQuery(
    [CachePrefixKeys.ACCOUNT, accountState.value.profile?.id],
    () => AccountRepo.fetchAccount(accountState.value.profile?.id!),
    {
      enabled: !!accountState.value.profile?.id,
    }
  );

  return {
    bookmarkState: {
      listFriendsQuery,
      listPostsQuery,
      accountQuery,
      listAccountsQuery,
    },
  };
};
