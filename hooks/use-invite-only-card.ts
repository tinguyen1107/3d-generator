import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { ChestDto } from '../dtos';
import moment from 'moment';
import { NFTRepo } from '../repos';

type InviteOnlyUserCardType = 'active' | 'inactive' | 'ready' | 'not_ready' | 'minted';

export const useInviteOnlyCard = (chest: ChestDto | undefined) => {
  const type: InviteOnlyUserCardType = !chest
    ? 'ready'
    : chest.did_mint
    ? 'minted'
    : moment(chest?.expired_at).unix() > moment().unix()
    ? 'active'
    : 'inactive';

  const nftQuery = useQuery(['NFT_Metadata', chest?.nft_id], () => NFTRepo.fetchNFTMetadata(chest!.nft_id), {
    enabled: !!chest?.nft_id,
  });

  // const accountQuery = useQuery(
  //   [CachePrefixKeys.ACCOUNT, accountId],
  //   () => AccountRepo.fetchAccount(accountId!),
  //   { enabled: !!accountId }
  // );
  //
  // const chests = useQuery(
  //   ['get_chests_by_account_id', accountId],
  //   () => ChestRepo.fetchChest(accountId!),
  //   {
  //     enabled: !!accountId,
  //   }
  // );

  return {
    inviteOnlyCardState: {
      type,
      nftQuery,
    },
  };
};
