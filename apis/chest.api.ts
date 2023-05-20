import { getContainer } from '../core';
import { TransactionAction } from '../core/types';
import { ChestAction, ChestDto, PostMediaEnum } from '../dtos';
import { RequestUtils } from '../utils';

enum ContractMethods {
  get_chests_by_account_id = 'get_chests_by_account_id',
  place_message_chest = 'place_message_chest',
  place_chest = 'place_chest',
  replace_chest_by_chest_id = 'replace_chest_by_chest_id',
  mint_chest = 'mint_chest',
}

export type PlaceChestInput = {
  id?: string;
  name: string;
  code: string;
  message: string;
  location: {
    lat: number;
    lng: number;
    label: string;
  };
  chestType: PostMediaEnum;
  chestTypeValue: string;
  expired_at?: number;
  action: ChestAction;
};

export const ChestApi = Object.freeze({
  async fetchChest(accountId: string): Promise<ChestDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_chests_by_account_id,
      args: {
        account_id: accountId,
      },
    });

    const chests = res.map((val: any) => mapToChest(val));
    const limitChests = accountId == 'neilharan.testnet' ? 8 : 4;
    return chests.concat(Array.from({ length: limitChests - chests.length }));
  },
  async placeMessageChest(input: PlaceChestInput): Promise<void> {
    const actions: TransactionAction[] = [];
    actions.push({
      methodName: ContractMethods.place_message_chest,
      args: {
        name: input.name,
        code: input.code,
        message: input.message,
        location: {
          lat: input.location.lat,
          lng: input.location.lng,
          label: input.location.label,
        },
        chest_type: {
          type: input.chestType || 'Standard',
          url: input.chestTypeValue,
        },
        expired_time: !!input.expired_at ? input.expired_at * 3600000000000 : undefined,
      },
      // deposit: !!input.expired_at
      //   ? `${(0.005 * input.expired_at * 1000).toFixed(0)}000000000000000000000`
      //   : '1200000000000000000000000',
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/home/',
      // getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async placeChest(input: PlaceChestInput): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.place_chest,
      args: {
        name: input.name,
        code: input.code,
        message: input.message,
        location: {
          lat: input.location.lat,
          lng: input.location.lng,
          label: input.location.label,
        },
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async replaceChest(chestId: string, input: PlaceChestInput): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.replace_chest_by_chest_id,
      args: {
        chest_id: chestId,
        name: input.name,
        code: input.code,
        message: input.message,
        location: {
          lat: input.location.lat,
          lng: input.location.lng,
          label: input.location.label,
        },
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async mintChest(chestId: string, accountId: string, doubleSelfieUrl: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.mint_chest,
      args: {
        chest_id: chestId,
        account_id: accountId,
        double_selfie_url: doubleSelfieUrl,
      },
      gas: '300000000000000',
      deposit: '1000000000000000000000000',
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
});

const mapToChest = (raw: any): ChestDto => {
  const time = Math.floor(Number.parseInt(raw.time) / 1000000);
  const expired_time = Math.floor(Number.parseInt(raw.expired_time) / 1000000);
  let chest: ChestDto = {
    id: raw.id,
    account_id: raw.account_id,
    name: raw.name,
    code: raw.code,
    location: {
      label: raw.location.label,
      lat: raw.location.lat,
      lng: raw.location.lng,
    },
    message: raw.message,
    time,
    expired_time,
    did_mint: raw.chest_type.is_minted,
    nft_id: raw.chest_type.nft_id,
    expired_at: time + expired_time,
  };

  return chest;
};
