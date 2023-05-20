import BN from 'bn.js';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { MIN_ENOUGH_STORAGE_BALANCE } from '../constants';
import { getContainer } from '../core';
import { BalanceDto } from '../dtos';

enum ContractMethods {
  storage_balance_of = 'storage_balance_of',
  storage_deposit = 'storage_deposit',
}

export const BalanceApi = Object.freeze({
  async fetchBalance(): Promise<BalanceDto> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.storage_balance_of,
      args: {
        account_id: getContainer().bcConnector.wallet.getAccountId(),
      },
    });
    return mapToBalance(res);
  },
  async storageDeposit(args: { sender_id?: string }): Promise<void> {
    await getContainer().bcConnector.callChangeMethod({
      methodName: ContractMethods.storage_deposit,
      args,
      attachedDeposit: new BN(parseNearAmount('0.2') ?? 0),
    });
  },
});

const mapToBalance = (raw: any): BalanceDto => {
  const available = new BN(raw.available);

  return {
    ...raw,
    isEnough: available.gt(MIN_ENOUGH_STORAGE_BALANCE),
  };
};
