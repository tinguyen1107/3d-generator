import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { ModalUtils } from '../../utils';

interface WarningModalData {
  continue?: () => void;
}

export const WarningModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = React.useState<WarningModalData>({});

  useEffect(() => {
    ModalUtils.warning.onOpen = (data: { continue: () => void }) => {
      setData(data);
      onOpen();
    };
    ModalUtils.warning.onClose = onClose;
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Warning</ModalHeader>
        <ModalBody>When moving out, you will losing all data that you have filled in.</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (!!data.continue) data.continue();
              onClose();
            }}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
