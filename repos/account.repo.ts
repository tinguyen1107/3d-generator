import { AccountApi, AccountsFilter } from '../apis';
import { SetAboutMeInput, AccountDto, BalanceDto } from '../dtos';

export class AccountRepo {
  static async storageDeposit(): Promise<void> {
    return AccountApi.storageDeposit();
  }
  static async follow(accountId: string) {
    return AccountApi.follow(accountId);
  }
  static async unfollow(accountId: string) {
    return AccountApi.unfollow(accountId);
  }
  static async setThumbnail(thumbnail: string) {
    return AccountApi.setThumbnail(thumbnail);
  }
  static async setBio(bio: string) {
    return AccountApi.setBio(bio);
  }
  static async setAvatar(avatar: string) {
    return AccountApi.setAvatar(avatar);
  }
  static async updateProfile(data: SetAboutMeInput) {
    return AccountApi.updateProfile(data);
  }
  static async setAbountMe(data: SetAboutMeInput) {
    return AccountApi.setAboutMe(data);
  }
  ///
  static async isRegistered(accountId: string): Promise<boolean> {
    return AccountApi.isRegistered(accountId);
  }
  static async storageMinimumBalance(): Promise<number> {
    return AccountApi.storageMinimumBalance();
  }
  static async storageBalanceOf(): Promise<BalanceDto> {
    return AccountApi.storageBalanceOf();
  }
  static async getUserInfo(accountId: string): Promise<AccountDto> {
    return AccountApi.fetchAccount(accountId);
  }
  static async isAdmin(accountId: string): Promise<boolean> {
    return AccountApi.isAdmin(accountId);
  }
  static async fetchFollowing(accountId: string, filter?: AccountsFilter): Promise<AccountDto[]> {
    return AccountApi.fetchFollowing(accountId, filter);
  }
  static async fetchFollowers(accountId: string, filter?: AccountsFilter): Promise<AccountDto[]> {
    return AccountApi.fetchFollowers(accountId, filter);
  }
  static async getNumPostsByAccountId(accountId: string): Promise<number> {
    return AccountApi.getNumPostsByAccountId(accountId);
  }
  static async getLikedPostIds(accountId: string): Promise<string[]> {
    return AccountApi.getLikedPostIds(accountId);
  }
  static async fetchAccountsWithNumPosts(filter?: AccountsFilter): Promise<AccountDto[]> {
    const data = await AccountApi.fetchAccountsWithNumPosts(filter);
    return data;
  }
  static async fetchAccounts(filter?: AccountsFilter): Promise<AccountDto[]> {
    return AccountApi.fetchAccounts(filter);
  }
  static async fetchAccount(accountId: string): Promise<AccountDto> {
    return AccountApi.fetchAccount(accountId);
  }
}
