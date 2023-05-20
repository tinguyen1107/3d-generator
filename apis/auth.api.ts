import axios from 'axios';
import { REP_BE_URL } from '../configs';

export const AuthApi = Object.freeze({
  async createAccount(payload: { accountId: string; publicKey: string }): Promise<boolean> {
    return (await axios.post(REP_BE_URL + '/create-account', payload)).data;
  },
  async getAccountIdByPublicKey({ publicKey }: { publicKey: string }) {
    return (await axios.get(`https://testnet-api.kitwallet.app/publicKey/${publicKey}/accounts`)).data[0];
  },
});
