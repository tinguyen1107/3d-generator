import React from 'react';
import { State, useHookstate } from '@hookstate/core';
import { BlockChainState, BlockchainState } from '../store';
import { parseToUsername } from '../utils';
import { CHAT_PRIVATE_KEY, StorageKeys } from '../../constants';
import { NearConnector, NearSignInOptions } from '../blockchain/near';
import { getContainer } from '..';

export const useBlockchain = ({
  connector,
  state,
}: {
  connector?: NearConnector;
  state?: State<BlockChainState>;
} = {}) => {
  const bcConnector: NearConnector = connector ?? getContainer().bcConnector;
  const blockchainState = useHookstate(state ?? BlockchainState);

  const _checkLogged = async () => {
    const isSignedIn = await bcConnector.isSignedIn();
    blockchainState.wallet.merge({
      logged: isSignedIn,
    });
    if (isSignedIn) {
      const accountId = bcConnector.wallet.getAccountId();
      console.log('connect? ', accountId);
      blockchainState.accountId.set(accountId);
      // get account balance
      const accountBalance = await getContainer().bcConnector.wallet.account().getAccountBalance();

      // update wallet state
      blockchainState.wallet.account.merge({
        id: accountId,
        username: parseToUsername(accountId),
        balance: accountBalance,
      });
    }
    blockchainState.wallet.merge({
      loading: false,
    });
  };

  /////

  const connect = React.useCallback(async () => {
    await bcConnector.connect();
    blockchainState.merge({
      loading: false,
      ready: true,
    });
    await _checkLogged();
  }, []);

  const signIn = React.useCallback(async (options?: NearSignInOptions) => {
    if (blockchainState.ready.value) {
      blockchainState.wallet.loading.set(true);
      await bcConnector.signIn();
    }
  }, []);

  const signOut = React.useCallback(async ({ isReload = true }: { isReload?: boolean } = {}) => {
    if (blockchainState.ready.value) {
      blockchainState.wallet.loading.set(true);
      await bcConnector.signOut();
      bcConnector.wallet._keyStore.clear();
      localStorage.removeItem(CHAT_PRIVATE_KEY);
      localStorage.removeItem(StorageKeys.CONTRACT_ID);
      localStorage.removeItem(StorageKeys.IS_USE_OAUTH);

      if (isReload) window.location.replace('/');
      // await _checkLogged();
    }
  }, []);

  return {
    blockchainState,
    blockchainMethods: {
      connect,
      signIn,
      signOut,
    },
  };
};
