import { ChestApi, PlaceChestInput } from '../apis';
import { ChatApi } from '../apis/chat.api';
import { ChestDto } from '../dtos';

export class ChatRepo {
  static async fetchMessage({
    blockId,
    roomId,
    priKey,
    latestMessage,
  }: {
    blockId?: number;
    roomId: string;
    priKey: CryptoKey;
    latestMessage?: any;
  }): Promise<any> {
    return ChatApi.fetchMessage({ blockId, roomId, priKey, latestMessage });
  }

  static async fetchMessages({
    blockId,
    roomId,
    priKey,
  }: {
    blockId?: number;
    roomId: string;
    priKey: CryptoKey;
  }): Promise<any[]> {
    return ChatApi.fetchMessages({
      blockId,
      roomId,
      priKey,
    });
  }

  static sendMessage(payload: { receiverId: string; senderBody: string; receiverBody: string }): Promise<void> {
    return ChatApi.sendMessage(payload);
  }

  static setPubKey(pubKey: string) {
    return ChatApi.setPubKey(pubKey);
  }
}
