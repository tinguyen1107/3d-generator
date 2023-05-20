import { hookstate, State } from '@hookstate/core';

export type ChestState = {
  chestId?: string;
  action?: any;
};

export const ChestState: State<ChestState> = hookstate({} as ChestState);
