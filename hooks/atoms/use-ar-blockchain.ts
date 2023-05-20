import { AppContainer } from '../../container';
import { getContainer } from '../../core';
import { useBlockchain } from '../../core/hooks';
import { ArBlockchainState } from '../../store';

export const useArBlockchain = () => {
  const { blockchainState, blockchainMethods } = useBlockchain({
    connector: getContainer<AppContainer>().arConnector,
    state: ArBlockchainState,
  });

  return {
    arBlockchainState: blockchainState,
    arBlockchainMethods: blockchainMethods,
  };
};
