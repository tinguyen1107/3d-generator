import { BalanceApi } from '../apis/balance.api';
import { BalanceDto } from '../dtos';

export class BalanceRepo {
  static async fetchBalance(): Promise<BalanceDto> {
    return BalanceApi.fetchBalance();
  }
  static storageDeposit = BalanceApi.storageDeposit;
}
