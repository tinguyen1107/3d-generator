import { useMutation } from 'react-query';
import { AccountRepo } from '../repos';
import { useCallback } from 'react';

export const useStorageDeposit = ({ onSuccess, onError }: { onSuccess?: () => void; onError?: (e: any) => void }) => {
  const useStorageDepositMutation = useMutation(() => AccountRepo.storageDeposit());

  const deposit = useCallback(
    () =>
      useStorageDepositMutation.mutateAsync(undefined, {
        onSuccess,
        onError,
      }),
    []
  );

  return {
    storageDepositState: {
      isLoading: useStorageDepositMutation.isLoading,
      data: useStorageDepositMutation.data,
    },
    storageDepositMethods: {
      deposit,
    },
  };
};
