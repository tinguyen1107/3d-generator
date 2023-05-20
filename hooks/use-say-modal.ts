import { useDisclosure } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { PostType } from '../dtos';
import { ModalUtils } from '../utils';

export const useSayModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formState, setFormState] = React.useState<PostType>({
    type: 'Standard',
  });

  useEffect(() => {
    ModalUtils.sayModal.onOpen = (data?: PostType) => {
      setFormState(data ?? { type: 'Standard' });
      onOpen();
    };
    ModalUtils.sayModal.onClose = onClose;
  }, []);

  return {
    sayModalState: { isOpen, formState },
    sayModalMethods: { onOpen, onClose, setFormState },
  };
};
