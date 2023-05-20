import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { CachePrefixKeys } from '../constants';
import { useBlockchain, useWalletAccountId } from '../core/hooks';
import { AccountRepo } from '../repos';

export const useHeader = () => {
  const router = useRouter();
  const { blockchainState, blockchainMethods } = useBlockchain();
  const { accountId } = useWalletAccountId();

  const accountQuery = useQuery([CachePrefixKeys.ACCOUNT, accountId], () => AccountRepo.getUserInfo(accountId!), {
    enabled: !!accountId,
  });

  const brandOnClick = useCallback(() => router.push('/'), [router]);

  return {
    headerState: {
      blockchainLoading: blockchainState.loading.value,
      walletLoading: blockchainState.wallet.loading.value,
      logged: blockchainState.wallet.logged.value,
      account: accountQuery.data,
      accountId,
    },
    headerMethods: {
      signIn: blockchainMethods.signIn,
      signOut: () => {
        blockchainMethods.signOut();
      },
      brandOnClick,
    },
  };
};
