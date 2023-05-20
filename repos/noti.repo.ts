import { NotiApi } from '../apis';
import { NotiDto } from '../dtos';

export class NotiRepo {
  static async fetchListNoti(): Promise<NotiDto[]> {
    return NotiApi.fetchListNoti();
  }
  static async registerToken(token: string): Promise<void> {
    return NotiApi.registerToken(token);
  }
}
