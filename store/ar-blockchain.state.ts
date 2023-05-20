import { State, hookstate } from '@hookstate/core';
import { BlockChainState } from '../core/store';

export const ArBlockchainState: State<BlockChainState> = hookstate({
  loading: true,
  ready: false,
  wallet: {
    loading: true,
    logged: false,
  },
} as BlockChainState);
