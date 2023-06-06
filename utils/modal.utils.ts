import { ModalStateType } from '../core/types';

export const ModalUtils: {
  storageDeposit: ModalStateType;
  warning: ModalStateType;
} = Object.freeze({
  storageDeposit: {
    onOpen: () => { },
    onClose: () => { },
  },
  warning: {
    onOpen: () => { },
    onClose: () => { },
  },
});
