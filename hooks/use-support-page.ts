import { useHookstate } from '@hookstate/core';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { Optional } from '../core/types';
import { AccountDto } from '../dtos';
import { AccountRepo } from '../repos';
import { NotiRepo } from '../repos/noti.repo';
import { AccountState } from '../store';
import { useSupport } from './';

export const useSupportPage = () => {
  const { createSupportForm, createSupportPublishing, handleCreateSupportFormSubmit } = useSupport();
  // const accountState = useHookstate(AccountState);
  // const [isFollowers, setIsFollowers] = useState<boolean>(isFollower);

  // const accountQuery = useQuery<AccountDto>(
  //   [CachePrefixKeys.ACCOUNT, accountId],
  //   () => AccountRepo.fetchAccount(accountId!),
  //   {
  //     enabled: !!accountId,
  //   }
  // );
  //
  // const getListFollowingQuery = useQuery(['list_following', accountId], () => AccountRepo.fetchFollowing(accountId), {
  //   enabled: !!accountState.value.profile?.id,
  // });
  // const getListFollowersQuery = useQuery(['list_followers', accountId], () => AccountRepo.fetchFollowers(accountId), {
  //   enabled: !!accountState.value.profile?.id,
  // });
  // const btnFollowersOnClick = useCallback(() => {
  //   setIsFollowers(true);
  // }, []);
  //
  // const btnFollowingOnClick = useCallback(() => {
  //   setIsFollowers(false);
  // }, []);

  return {
    supportState: {
      createSupportForm,
      createSupportPublishing,
    },
    supportMethod: {
      handleCreateSupportFormSubmit,
    },
  };
};
