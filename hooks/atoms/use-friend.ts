import { useHookstate } from '@hookstate/core';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../../constants';
import { AccountRepo } from '../../repos';
import { AccountState, AppState, PostState } from '../../store';

export const useFriend = (accountId?: string) => {
  const postState = useHookstate(PostState);
  const accountState = useHookstate(AccountState);
  const appState = useHookstate(AppState);

  const listFriendsQuery = useQuery(
    [CachePrefixKeys.ACCOUNT_FOLLOWING, accountId || accountState.value.profile?.id],
    () => AccountRepo.fetchFollowing(accountId || accountState.value.profile?.id!),
    { enabled: !!accountId || !!accountState.value.profile?.id }
  );

  return {
    friendState: {
      listFriendsQuery,
    },
  };
};
