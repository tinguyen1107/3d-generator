import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { CachePrefixKeys } from '../constants';
import { useWalletAccountId } from '../core/hooks';
import { AccountRepo } from '../repos';
import { useIsAdmin } from './atoms';
import { useInitialize } from './use-initialize';

export const useLayout = () => {
  const router = useRouter();
  const { accountId: walletAccountId } = useWalletAccountId();
  const { appState } = useInitialize();
  const { isAdmin } = useIsAdmin();

  const accountId = useMemo(() => router.query.accountId as string, [router.query.accountId]);

  const isOwner = useMemo(() => router.query.accountId === walletAccountId, [router.query.accountId, walletAccountId]);

  const accountQuery = useQuery([CachePrefixKeys.ACCOUNT, accountId], () => AccountRepo.getUserInfo(accountId), {
    enabled: !!accountId,
  });

  return {
    accountLayoutState: {
      accountId,
      isOwner,
      profile: accountQuery.data,
      isLoading: accountQuery.isLoading && appState.loading,
      isAdmin,
      isAppLoading: appState.loading,
    },
    accountLayoutMethods: {},
  };
};
