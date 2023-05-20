import { useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ModalUtils } from '../utils';

export const useConnectWalletModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    ModalUtils.connectWallet.onOpen = onOpen;
    ModalUtils.connectWallet.onClose = onClose;
  }, []);

  return {
    connectWalletModalState: { isOpen },
    connectWalletModalMethods: { onOpen, onClose },
  };
};
