import { BN } from 'bn.js';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { AppContainer } from '../container';
import { getContainer } from '../core';
import { TransactionAction } from '../core/types';
import { SetAboutMeInput, AccountDto, BalanceDto, AboutMeDto } from '../dtos';
import { RequestUtils } from '../utils';

enum ContractMethods {
  storage_deposit = 'storage_deposit',
  storage_withdraw = 'storage_withdraw',
  deposit = 'deposit',
  withdraw = 'withdraw',
  update_bio = 'update_bio',
  follow = 'follow',
  unfollow = 'unfollow',
  set_avatar = 'set_avatar',
  set_thumbnail = 'set_thumbnail',
  set_bio = 'set_bio',
  update_profile = 'update_profile',
  set_aboutme = 'set_aboutme',
  ///
  is_registered = 'is_registered',
  user_info = 'user_info',
  storage_minimum_balance = 'storage_minimum_balance',
  storage_balance_of = 'storage_balance_of',
  is_admin = 'is_admin',
  get_following = 'get_following',
  get_followers = 'get_followers',
  get_accounts = 'get_accounts',
  get_accounts_with_num_posts = 'get_accounts_with_num_posts',
  get_account = 'get_account',
  get_num_posts_by_account = 'get_num_posts_by_account',
  get_voted_posts_by_account = 'get_voted_posts_by_account',
  get_accounts_with_ids = 'get_accounts_with_ids',
}

export type AccountsFilter = {
  keyword?: string;
  offset?: number;
  limit?: number;
};

export type AccountProfileInput = {
  displayName?: string;
  bio?: string;
  profileImage?: string;
  coverImage: string;
};

export const AccountApi = Object.freeze({
  async storageDeposit(): Promise<void> {
    await getContainer().bcConnector.callChangeMethod({
      methodName: ContractMethods.storage_deposit,
      args: {},
      attachedDeposit: new BN(parseNearAmount('0.2') ?? 0),
    });
  },
  async follow(accountId: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.follow,
      args: {
        account_id: accountId,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async unfollow(accountId: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.unfollow,
      args: {
        account_id: accountId,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async setThumbnail(thumbnail: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.set_thumbnail,
      args: {
        thumbnail,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async setAvatar(avatar: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.set_avatar,
      args: {
        avatar,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async setBio(bio: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.set_bio,
      args: {
        bio,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async updateProfile(data: SetAboutMeInput): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.update_profile,
      args: {
        display_name: data.first_name + ' ' + data.last_name,
        bio: data.about,
        avatar: data.avatar,
        thumbnail: data.cover_image,
        about_me: btoa(JSON.stringify(data)),
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async setAboutMe(input: SetAboutMeInput): Promise<void> {
    const args = {
      about_me: btoa(JSON.stringify(input)),
    };

    await getContainer().bcConnector.callChangeMethod({
      methodName: ContractMethods.set_aboutme,
      args,
    });
  },
  ///
  async isRegistered(account_id: string): Promise<boolean> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.is_registered,
      args: {
        account_id: getContainer().bcConnector.wallet.getAccountId(),
      },
    });
    return res;
  },
  async storageMinimumBalance(): Promise<number> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.storage_minimum_balance,
      args: {},
    });
    return res;
  },
  async storageBalanceOf(): Promise<BalanceDto> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.storage_balance_of,
      args: {
        account_id: getContainer().bcConnector.wallet.getAccountId(),
      },
    });
    return res;
  },
  async getUserInfo(account_id: string): Promise<AccountDto> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.user_info,
      args: {
        account_id,
      },
    });
    return res;
  },
  async isAdmin(account_id: string): Promise<boolean> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.is_admin,
      args: {
        account_id,
      },
    });
    return res;
  },
  async fetchFollowing(accountId: string, filter?: AccountsFilter): Promise<AccountDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_following,
      args: {
        account_id: accountId,
        from_index: filter?.offset ?? 0,
        limit: filter?.limit ?? 100,
      },
    });
    return mapToAccounts(res);
  },
  async fetchFollowers(accountId: string, filter?: AccountsFilter): Promise<AccountDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_followers,
      args: {
        account_id: accountId,
        from_index: filter?.offset ?? 0,
        limit: filter?.limit ?? 100,
      },
    });
    return mapToAccounts(res);
  },
  async getLikedPostIds(account_id: string): Promise<string[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_voted_posts_by_account,
      args: {
        account_id,
      },
    });
    return res;
  },
  async getNumPostsByAccountId(accountId: string): Promise<number> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_num_posts_by_account,
      args: {
        account_id: accountId,
      },
    });
    return res;
  },
  async fetchAccountsWithNumPosts(filter?: AccountsFilter): Promise<AccountDto[]> {
    let accounts: AccountDto[] = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_accounts_with_num_posts,
      args: {
        from_index: filter?.offset ?? 0,
        limit: filter?.limit ?? 100,
      },
    });
    accounts = mapToAccounts(accounts);

    // const numPosts = await Promise.all(accounts.map((item) => this.getNumPostsByAccountId(item.id)));

    accounts = accounts.sort((a: any, b: any) => {
      return b.num_posts - a.num_posts;
    });

    return accounts;
  },
  async fetchAccounts(filter?: AccountsFilter): Promise<AccountDto[]> {
    let accounts: AccountDto[] = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_accounts,
      args: {
        from_index: filter?.offset ?? 0,
        limit: filter?.limit ?? 100,
      },
    });
    accounts = mapToAccounts(accounts);

    if (filter?.keyword) {
      accounts = accounts.filter((a) => a.id.toLowerCase().includes(filter!.keyword!.toLowerCase()));
    }
    return accounts;
  },
  async fetchAccount(accountId: string): Promise<AccountDto> {
    if (accountId.toLowerCase() == 'root') {
      return {
        id: 'root',
        numFollowers: 0,
        numFollowing: 0,
        numPosts: 0,
        lastPostHeight: 0,
        invitedBy: '',
        avatar:
          'https://w7.pngwing.com/pngs/109/402/png-transparent-computer-icons-computer-software-astronaut-avatar-astronauts-miscellaneous-logo-data.png',
        thumbnail: '',
        bio: '',
        displayName: 'System',
        relatedConversations: [],
        messagePubKey: '',
        about_me: {},
      };
    }
    let account: AccountDto = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_account,
      args: {
        account_id: accountId,
      },
    });
    if (account) {
      return mapToAccount({ ...account, account_id: accountId });
    }
    throw new Error(`Account does not exist ${accountId}`);
  },
  async fetchAccountsByIds(account_ids: string[]): Promise<AccountDto[]> {
    let res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_accounts_with_ids,
      args: {
        account_ids,
      },
    });
    const accounts = mapToAccounts(res.map((item: any, index: any) => [account_ids[index], item]));

    return accounts;
  },
});

const mapToAccounts = (raws: any[]): AccountDto[] => {
  return raws.map<AccountDto>((item) => {
    return mapToRawAccount(item);
  });
};

const mapToRawAccount = (item: any): AccountDto => {
  const about_me: AboutMeDto = item[1]?.about_me ? JSON.parse(atob(item[1]?.about_me)) : null;
  const displayName = about_me == null ? '' : about_me.first_name + ' ' + about_me.last_name;
  return {
    id: item[0],
    numFollowers: item[1]?.num_followers,
    numFollowing: item[1]?.num_following,
    numPosts: item[1]?.num_posts,
    lastPostHeight: item[1]?.last_post_height,
    avatar: item[1]?.avatar,
    thumbnail: item[1]?.thumbnail,
    bio: about_me == null ? '' : about_me.about ?? '',
    displayName,
    invitedBy: item?.invited_by,
    relatedConversations: item[1]?.related_conversations,
    messagePubKey: item[1]?.message_pub_key,
    about_me,
  };
};

const mapToAccount = (item: any): AccountDto => {
  const about_me: AboutMeDto = item?.about_me ? JSON.parse(atob(item?.about_me)) : null;
  let displayName = '';
  if (!!about_me) {
    if (!!about_me.first_name) displayName += about_me.first_name;
    if (!!about_me.last_name) displayName += ' ' + about_me.last_name;
  }
  displayName = displayName.trim();
  return {
    id: item.account_id,
    numFollowers: item.num_followers,
    numFollowing: item.num_following,
    numPosts: item.num_posts,
    lastPostHeight: item.last_post_height,
    avatar: item.avatar,
    thumbnail: item.thumbnail,
    bio: about_me == null ? '' : about_me.about ?? '',
    displayName,
    invitedBy: item.invited_by,
    relatedConversations: item.related_conversations,
    messagePubKey: item.message_pub_key,
    about_me,
  };
};
