import { useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ModalUtils, toastBaseConfig } from '../utils';
import { useAccount } from './atoms';
import { useStorageDeposit } from './use-storage-deposit';

export const useStorageDepositModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { accountMethods } = useAccount();
  const { storageDepositState, storageDepositMethods } = useStorageDeposit({
    onSuccess: async () => {
      onClose();
      await accountMethods.fetchBalance();
      toast({
        title: 'Deposit successfully',
        status: 'success',
        ...toastBaseConfig,
      });
    },
    onError: () => {
      onClose();
      toast({
        title: 'Deposit failed',
        status: 'error',
        ...toastBaseConfig,
      });
    },
  });

  useEffect(() => {
    ModalUtils.storageDeposit.onOpen = onOpen;
    ModalUtils.storageDeposit.onClose = onClose;
  }, []);

  return {
    storageDepositModalState: { isOpen, storageDepositState },
    storageDepositModalMethods: { onOpen, onClose, storageDepositMethods },
  };
};
