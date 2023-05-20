import { NFTApi } from '../apis';
import { GetListInput, Optional } from '../core/types';
import { DB } from '../db';
import { CategoryDto, NFT, NFTMetadata } from '../dtos';

export class NFTRepo {
  static async fetchListNFTs(): Promise<NFT[]> {
    return NFTApi.fetchListNFTs();
  }
  static async fetchNFTMetadata(tokenId: string): Promise<Optional<NFTMetadata>> {
    return NFTApi.fetchNFTMetadata(tokenId);
  }

  static async mintRootInvitationNFT(): Promise<void> {
    return NFTApi.mintRootInvitationNFT();
  }
}
