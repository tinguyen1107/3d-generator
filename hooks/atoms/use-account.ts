import { useHookstate } from '@hookstate/core';
import { useCallback } from 'react';
import { useWalletAccountId } from '../../core/hooks';
import { AccountRepo, BalanceRepo } from '../../repos';
import { AccountState } from '../../store';

export const useAccount = () => {
  const accountState = useHookstate(AccountState);
  const { accountId } = useWalletAccountId();

  const fetchProfile = useCallback(async () => {
    if (accountId) {
      try {
        const profile = await AccountRepo.fetchAccount(accountId);
        accountState.profile.set(profile);
      } catch (error) {
        accountState.profile.merge({ id: accountId });
      }
    }
  }, [accountId]);

  const fetchBalance = useCallback(async () => {
    if (accountId) {
      const balance = await BalanceRepo.fetchBalance();
      accountState.balance.set(balance);
    }
  }, [accountId]);

  return {
    accountState,
    accountMethods: {
      fetchProfile,
      fetchBalance,
    },
  };
};
