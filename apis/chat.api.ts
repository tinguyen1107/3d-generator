import { getContainer } from '../core';
import { IPFSUtils, str2ab } from '../utils';

const decryptMessageBody = async (priKey: CryptoKey, body: string) => {
  // const dec = new TextDecoder();
  try {
    const bodyDecrypted = body;
    // dec.decode(
    //   await window.crypto.subtle.decrypt(
    //     {
    //       name: 'RSA-OAEP',
    //     },
    //     priKey,
    //     str2ab(body)
    //   )
    // );

    return await IPFSUtils.getDataFromIPFS(bodyDecrypted);
  } catch (error: any) {
    console.error(error);
    return '*****';
  }
};

export const ChatApi = Object.freeze({
  async fetchMessage({
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
    await getContainer().bcConnector.updateLastBlockHeight();
    const res = await getContainer().bcConnector.getBlock({
      blockId: blockId ?? getContainer().bcConnector.lastBlockHeight,
      methodName: 'get_message',
      args: { message_id: roomId },
    });

    if (latestMessage && latestMessage.block_height === res.block_height) {
      return latestMessage;
    }

    if (priKey) {
      if (res.sender_id === getContainer().bcConnector.wallet.getAccountId()) {
        res.sender_body = await decryptMessageBody(priKey, res.sender_body);
      } else {
        res.receiver_body = await decryptMessageBody(priKey, res.receiver_body);
      }
    }

    return res;
  },
  ///
  async fetchMessages({
    blockId,
    roomId,
    priKey,
  }: {
    blockId?: number;
    roomId: string;
    priKey: CryptoKey;
  }): Promise<any[]> {
    const limit = 20;
    const arr: any = [];
    let count = 0;
    await getContainer().bcConnector.updateLastBlockHeight();
    let currentBlockId = blockId || getContainer().bcConnector.lastBlockHeight;

    while (count < limit && currentBlockId !== 0) {
      const res: any = await getContainer().bcConnector.getBlock({
        blockId: currentBlockId,
        methodName: 'get_message',
        args: { message_id: roomId },
      });

      if (priKey) {
        if (res.sender_id === getContainer().bcConnector.wallet.getAccountId()) {
          res.sender_body = await decryptMessageBody(priKey, res.sender_body);
        } else {
          res.receiver_body = await decryptMessageBody(priKey, res.receiver_body);
        }
      }

      arr.push(res);
      count++;
      currentBlockId = res.last_message_height;
    }
    return arr;
  },
  async sendMessage(payload: { receiverId: string; senderBody: string; receiverBody: string }): Promise<void> {
    let retries = 0;
    let success = false;
    while (retries < 3 && !success) {
      try {
        await getContainer().bcConnector.callChangeMethod({
          methodName: 'new_message',
          args: {
            receiver_id: payload.receiverId,
            receiver_body: payload.receiverBody,
            sender_body: payload.senderBody,
          },
        });
        success = true;
      } catch (error) {
        retries++;
      }
    }
  },
  async setPubKey(pubKey: string): Promise<void> {
    await getContainer().bcConnector.callChangeMethod({
      methodName: 'set_pub_key',
      args: {
        pub_key: pubKey,
      },
    });
  },
});
