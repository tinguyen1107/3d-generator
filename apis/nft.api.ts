import { BN } from 'bn.js';
import { RAWBOT_NFT_CONTRACT_NAME } from '../constants';
import { getContainer } from '../core';
import { Optional } from '../core/types';
import { NFTMetadata, NFT } from '../dtos';

enum ContractMethods {
  tokens_metadata_of_owner = 'tokens_metadata_of_owner',
  token_metadata = 'token_metadata',
  mint_root_invite = 'mint_root_invite',
}

export const NFTApi = Object.freeze({
  async fetchListNFTs(): Promise<NFT[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      contractId: RAWBOT_NFT_CONTRACT_NAME,
      methodName: ContractMethods.tokens_metadata_of_owner,
      args: {
        owner_id: getContainer().bcConnector.wallet.getAccountId(),
      },
    });

    return res.map((item: any) => {
      return {
        ...item,
        tokenId: item.token_id,
        metadata: {
          ...item.metadata,
          media: item.metadata.media.replace('gateway.pinata.cloud', ''),
        },
      };
    });
  },

  async fetchNFTMetadata(tokenId: string): Promise<Optional<NFTMetadata>> {
    try {
      const res = await getContainer().bcConnector.callViewMethod({
        contractId: RAWBOT_NFT_CONTRACT_NAME,
        methodName: ContractMethods.token_metadata,
        args: {
          token_id: tokenId,
        },
      });

      return res;
    } catch (err) {
      console.log(err);
    }
  },

  async mintRootInvitationNFT(): Promise<void> {
    try {
      const res = await getContainer().bcConnector.callChangeMethodWithoutStorage({
        methodName: ContractMethods.mint_root_invite,
        args: {},
        attachedDeposit: new BN('100000000000000000000000'),
      });

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
});
