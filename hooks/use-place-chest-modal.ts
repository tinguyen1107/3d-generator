import { useDisclosure } from '@chakra-ui/react';
import { useHookstate } from '@hookstate/core';
import { useCallback, useEffect } from 'react';
import { ChestState } from '../store';
import { ModalUtils } from '../utils';

export const usePlaceChestModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chestState = useHookstate(ChestState);

  const handleOpen = useCallback((payload: ChestState) => {
    chestState.merge(payload);
    onOpen();
  }, []);

  const handleClose = useCallback(() => {
    chestState.set({});
    onClose();
  }, []);

  useEffect(() => {
    ModalUtils.placeChest.onOpen = handleOpen;
    ModalUtils.placeChest.onClose = handleClose;
  }, []);

  return {
    placeChestModalState: { isOpen, chestState },
    placeChestModalMethods: { onOpen: handleOpen, onClose: handleClose },
  };
};
