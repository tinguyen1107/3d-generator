import { useMutation } from 'react-query';
import { AccountRepo } from '../repos';
import { useCallback } from 'react';

export const useArStorageDeposit = () => {
  const useArStorageDepositMutation = useMutation(() => AccountRepo.storageDeposit());

  const deposit = useCallback(() => useArStorageDepositMutation.mutateAsync(), []);

  return {
    arStorageDepositState: {
      isLoading: useArStorageDepositMutation.isLoading,
      data: useArStorageDepositMutation.data,
    },
    arStorageDepositMethods: {
      deposit,
    },
  };
};
