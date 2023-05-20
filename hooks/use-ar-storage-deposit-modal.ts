import { useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ModalUtils } from '../utils';
import { useArStorageDeposit } from './use-ar-storage-deposit';

export const useArStorageDepositModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { arStorageDepositState, arStorageDepositMethods } = useArStorageDeposit();

  useEffect(() => {
    ModalUtils.arStorageDeposit.onOpen = onOpen;
    ModalUtils.arStorageDeposit.onClose = onClose;
  }, []);

  return {
    arStorageDepositModalState: { isOpen, arStorageDepositState },
    arStorageDepositModalMethods: { onOpen, onClose, arStorageDepositMethods },
  };
};
