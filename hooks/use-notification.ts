import { useHookstate } from '@hookstate/core';
import { useQuery } from 'react-query';
import { NotiRepo } from '../repos/noti.repo';
import { AccountState } from '../store';

export const useNotification = () => {
  const accountState = useHookstate(AccountState);

  const getListNotiQuery = useQuery(['list_noti'], NotiRepo.fetchListNoti, {
    enabled: !!accountState.value.profile?.id,
  });
  return {
    notificationState: {
      getListNotiQuery,
    },
  };
};
