export type ChestDto = {
  id: string;
  account_id: string;
  name: string;
  code: string;
  message: string;
  location: {
    label: string;
    lat: number;
    lng: number;
  };
  time: number;
  expired_time: number;
  did_mint: boolean;
  nft_id: string;
  expired_at: number;
};

export type ChestAction = 'place' | 'replace';
