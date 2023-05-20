import { ChestApi, PlaceChestInput } from '../apis';
import { ChestDto } from '../dtos';

export class ChestRepo {
  static async fetchChest(accountId: string): Promise<ChestDto[]> {
    return ChestApi.fetchChest(accountId);
  }

  static async placeMessageChest(input: PlaceChestInput) {
    return ChestApi.placeMessageChest(input);
  }

  static async placeChest(input: PlaceChestInput) {
    return ChestApi.placeChest(input);
  }

  static replaceChest(chestId: string, input: PlaceChestInput) {
    return ChestApi.replaceChest(chestId, input);
  }
  static mintChest(chestId: string, accountId: string, doubleSelfieUrl: string) {
    return ChestApi.mintChest(chestId, accountId, doubleSelfieUrl);
  }
}
