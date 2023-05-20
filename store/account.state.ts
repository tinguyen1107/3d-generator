import { hookstate, State } from '@hookstate/core';
import { AccountDto, BalanceDto } from '../dtos';

export type AccountState = {
  loading: boolean;
  isRegistered?: boolean;
  isAdmin?: boolean;
  profile?: AccountDto;
  balance?: BalanceDto;
};
export const AccountState: State<AccountState> = hookstate({
  loading: true,
} as AccountState);
