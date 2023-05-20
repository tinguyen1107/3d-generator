import { useDisclosure } from '@chakra-ui/react';
import { useHookstate } from '@hookstate/core';
import { useCallback, useEffect } from 'react';
import { ChestState } from '../store';
import { ModalUtils } from '../utils';

export const useMintChestModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chestState = useHookstate(ChestState);

  const handleOpen = useCallback(({ chestId }: { chestId: string }) => {
    chestState.merge({ chestId });
    onOpen();
  }, []);

  const handleClose = useCallback(() => {
    chestState.set({});
    onClose();
  }, []);

  useEffect(() => {
    ModalUtils.mintChest.onOpen = handleOpen;
    ModalUtils.mintChest.onClose = handleClose;
  }, []);

  return {
    mintChestModalState: { isOpen, chestState },
    mintChestModalMethods: { onOpen: handleOpen, onClose: handleClose },
  };
};
