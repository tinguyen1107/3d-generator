import BN from 'bn.js';
import { MIN_ENOUGH_STORAGE_BALANCE } from '../constants';
import { BlockchainState } from '../core/store';
import { AccountState } from '../store';
import { ModalUtils } from './modal.utils';

export const AuthUtils = Object.freeze({
  async authCheckAndExec(exec?: (...args: any) => any): Promise<boolean> {
    const logged = BlockchainState.wallet.logged.value;
    if (!logged) {
      ModalUtils.connectWallet.onOpen();
      return false;
    }

    const isRegistered = AccountState.isRegistered.value;
    if (!isRegistered) {
      ModalUtils.addStorageBalance.onOpen();
      return false;
    }

    // if (!AccountState.balance.get()?.isEnough) {
    //   ModalUtils.addStorageBalance.onOpen();
    //   return false;
    // }

    if (exec) await exec();

    return true;
  },
});
