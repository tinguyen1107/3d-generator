import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { AccountRepo, ChestRepo } from '../repos';

export const useInviteOnlyContainer = (accountId?: string) => {
  const accountQuery = useQuery([CachePrefixKeys.ACCOUNT, accountId], () => AccountRepo.fetchAccount(accountId!), {
    enabled: !!accountId,
  });

  const isAdminQuery = useQuery([CachePrefixKeys.ACCOUNT, accountId], () => AccountRepo.isAdmin(accountId!), {
    enabled: !!accountId,
  });

  const chests = useQuery(['get_chests_by_account_id', accountId], () => ChestRepo.fetchChest(accountId!), {
    enabled: !!accountId,
  });

  return {
    inviteOnlyContainerState: {
      accountQuery,
      isAdminQuery,
      chests,
    },
  };
};
