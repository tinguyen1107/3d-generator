import axios from 'axios';
import { getContainer } from '../core';
import { NotiDto } from '../dtos';

const REP_BE_URL = 'https://rep-run-notification.tk';

export const NotiApi = Object.freeze({
  async fetchListNoti(): Promise<NotiDto[]> {
    try {
      const { data } = await axios.get(
        REP_BE_URL +
          '?offset=0&limit=20&accountId=' +
          getContainer().bcConnector.wallet.getAccountId().replace('.testnet', '')
      );
      return data;
    } catch (error) {
      return [];
    }
  },
  async registerToken(token: string) {
    if (getContainer().bcConnector.wallet.getAccountId())
      await axios.post(REP_BE_URL + '/register-token', {
        token,
        accountId: getContainer().bcConnector.wallet.getAccountId().replace('.testnet', ''),
      });
  },
});
