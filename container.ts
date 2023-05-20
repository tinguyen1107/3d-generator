import { NearRepARConfig } from './constants';
import { DefaultContainer, getContainer } from './core';
import { NearConnector } from './core/blockchain/near';
import { NearProtocalConfig } from './core/contants';
import { BlockchainState } from './core/store';
import { Container } from './core/types';
import { BalanceRepo } from './repos';
import { AccountState } from './store';

export type AppContainer = Container & {
  arConnector: NearConnector;
};

// Replace AppContainer to main container
if (!process.env.NEXT_RUNTIME) {
  const AppContainer: AppContainer = Object.freeze({
    bcConnector: new NearConnector(NearProtocalConfig, {
      afterCallChangeMethod: async () => {
        const accountId = BlockchainState.accountId.get();
        if (accountId) {
          const balance = await BalanceRepo.fetchBalance();
          AccountState.balance.set(balance);
        }
      },
    }),
    arConnector: new NearConnector(NearRepARConfig),
  });
  // @ts-ignore
  window.container = AppContainer;
}
