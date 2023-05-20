import { useMemo, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { toastBaseConfig } from '../utils';
import { NFTRepo } from '../repos';

export const useMintRootInvite = () => {
  const [mintNftPublishing, setMintNftPublishing] = useState(false);
  const toast = useToast();

  const handleMintInvitationNFTClick = useMemo(
    () => async () => {
      setMintNftPublishing(true);
      try {
        await NFTRepo.mintRootInvitationNFT();
        toast({ title: 'Mint NFT successful', status: 'success', ...toastBaseConfig });
      } catch (e) {
        console.error("Can't mint nft");
        toast({ title: 'Mint NFT failed', status: 'error', ...toastBaseConfig });
      } finally {
        setMintNftPublishing(false);
      }
    },
    []
  );

  return {
    mintNftPublishing,
    handleMintInvitationNFTClick,
  };
};
