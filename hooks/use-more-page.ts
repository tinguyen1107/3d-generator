import { useHookstate } from '@hookstate/core';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { AccountDto } from '../dtos';
import { AccountRepo } from '../repos';
import { AccountState } from '../store';

export const useMorePage = () => {
  const accountState = useHookstate(AccountState);

  const accountQuery = useQuery<AccountDto>(
    [CachePrefixKeys.ACCOUNT, accountState.value.profile?.id],
    () => AccountRepo.fetchAccount(accountState.value.profile?.id ?? ''),
    {
      enabled: !!accountState.value.profile?.id,
    }
  );

  return {
    morePageState: {
      accountQuery,
    },
  };
};
