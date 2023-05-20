import { useHookstate } from '@hookstate/core';
import React, { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AccountState } from '../../store';
import { AccountRepo } from '../../repos';
import { CachePrefixKeys } from '../../constants';
import { AuthUtils } from '../../utils';
import { FollowCache } from '../../cache';

export const useFollow = ({ accountId }: { accountId?: string }) => {
  const accountState = useHookstate(AccountState);
  const queryClient = useQueryClient();
  const [isHover, setIsHover] = useState(false);

  const accountFollowingQuery = useQuery(
    [CachePrefixKeys.ACCOUNT_FOLLOWING],
    () => AccountRepo.fetchFollowing(accountState.value.profile?.id!),
    {
      enabled: !!accountState.value.profile?.id,
      retry: 0,
    }
  );
  const accountFollowersQuery = useQuery(
    [CachePrefixKeys.ACCOUNT_FOLLOWERS],
    () => AccountRepo.fetchFollowers(accountState.value.profile?.id!),
    {
      enabled: !!accountState.value.profile?.id,
      retry: 0,
    }
  );

  const followAccountMutation = useMutation(() => AccountRepo.follow(accountId!), {
    onSuccess: async () => {
      await queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT_FOLLOWING]);
      queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT, accountId]);
      queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
    },
  });

  const unFollowAccountMutation = useMutation(() => AccountRepo.unfollow(accountId!), {
    onSuccess: async () => {
      await queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT_FOLLOWING]);
      queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT, accountId]);
      queryClient.invalidateQueries([CachePrefixKeys.LIST_POSTS]);
    },
  });

  const followAccount = useCallback(() => {
    FollowCache.set(accountId!, true);
    AuthUtils.authCheckAndExec(followAccountMutation.mutate);
  }, [accountId]);

  const unFollowAccount = useCallback(() => {
    FollowCache.set(accountId!, false);
    AuthUtils.authCheckAndExec(unFollowAccountMutation.mutate);
  }, [accountId]);

  const followed =
    FollowCache.get(accountId!) ?? !!accountFollowingQuery.data?.find((item: any) => item.id === accountId);
  const wasFollowed = !!accountFollowersQuery.data?.find((item: any) => item.id === accountId);
  // const isLoading = useMemo(() => {
  //   const isLoading =
  //     accountFollowingQuery.isLoading || followAccountMutation.isLoading || unFollowAccountMutation.isLoading;
  //   setIsHover(false);
  //   return isLoading;
  // }, [accountFollowingQuery.isLoading, followAccountMutation.isLoading, unFollowAccountMutation.isLoading]);
  const isLoading = useMemo(() => {
    const isLoading = accountFollowingQuery.isLoading;
    setIsHover(false);
    return isLoading;
  }, [accountFollowingQuery.isLoading]);

  const mouseOver = useCallback(() => {
    if (isLoading) return;
    setIsHover(true);
  }, [isLoading]);
  const mouseOut = useCallback(() => {
    if (isLoading) return;
    setIsHover(false);
  }, [isLoading]);

  return {
    followState: {
      isHover,
      followed,
      wasFollowed,
      isLoading,
    },
    followMethods: {
      mouseOver,
      mouseOut,
      followAccount,
      unFollowAccount,
    },
  };
};
