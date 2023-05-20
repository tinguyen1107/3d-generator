import { BN } from 'bn.js';
import { transactions } from 'near-api-js';
import { getContainer } from '../core';
import { NFT } from '../dtos';
import { AccountRepo, BalanceRepo } from '../repos';
import { ModalUtils } from '../utils';

export const RequestUtils = {
  async validateBeforeTransaction() {
    if (!getContainer().bcConnector.wallet.getAccountId()) {
      ModalUtils.connectWallet.onOpen();
      return false;
    }

    const balance = await BalanceRepo.fetchBalance();
    const isRegisterd = await AccountRepo.isRegistered(getContainer().bcConnector.wallet.getAccountId());

    if (!balance.isEnough && !isRegisterd) {
      ModalUtils.addStorageBalance.onOpen({
        onClick: async (nft?: NFT) => {
          let body = {};
          if (!!nft)
            body = {
              sender_id: nft.metadata.description.split(' ').pop(),
            };

          console.log('Data storage_deposit: ', body);
          await getContainer()
            .bcConnector.wallet.account()
            // @ts-ignore
            .signAndSendTransaction({
              receiverId: process.env.NEXT_PUBLIC_NEAR_CONTRACT_NAME!,
              actions: [
                transactions.functionCall(
                  'storage_deposit',
                  body,
                  new BN('30000000000000'),
                  new BN('200000000000000000000000')
                ),
              ],
            });
        },
      });
      return false;
    }

    return true;
  },
};
