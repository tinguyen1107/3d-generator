import { Nullable } from '../core/types';

export type NFTMetadata = {
  copies: number;
  description: string;
  expires_at: Nullable<Date>;
  extra: any;
  issued_at: Nullable<Date>;
  media: string;
  media_hash: Nullable<string>;
  reference: Nullable<string>;
  reference_hash: Nullable<string>;
  starts_at: Nullable<Date>;
  title: string;
  updated_at: Nullable<Date>;
};

export type NFT = {
  metadata: NFTMetadata;
  tokenId: string;
};
