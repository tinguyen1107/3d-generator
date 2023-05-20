import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RSA_PUBLIC_KEY } from '../constants';
import { AppContainer } from '../container';
import { getContainer } from '../core';
import moment from 'moment';
import { useBlockchain } from '../core/hooks';

export const useQrcodePage = (props?: { accountId?: string }) => {
  const router = useRouter();
  const { blockchainState, blockchainMethods } = useBlockchain();

  const btnBackToHomeOnClick = useCallback(() => {
    router.push('/home');
  }, []);

  const btnConnectWalletOnClick = useCallback(() => {
    blockchainMethods.signIn();
  }, []);

  const btnSwitchAccountOnClick = useCallback(async () => {
    await blockchainMethods.signOut();
    blockchainMethods.signIn();
  }, []);

  // const btnConnectWalletToRepOnClick = useCallback(() => {
  //   blockchainMethods.signIn();
  // }, []);

  const isLoading = useMemo(() => {
    return blockchainState.loading.value;
  }, [blockchainState.loading.value]);

  const logged = useMemo(() => {
    return blockchainState.wallet.logged.value;
  }, [blockchainState.wallet.logged.value]);

  // const accountId = useMemo(() => {
  //   let arAccountId =
  //     getContainer<AppContainer>().arConnector.wallet.getAccountId();
  //   let repAccountId = getContainer().bcConnector.wallet.getAccountId();
  //   if
  // }, [
  //   getContainer<AppContainer>().arConnector.wallet.getAccountId(),
  //   getContainer().bcConnector.wallet.getAccountId(),
  // ]);

  // const loggedToARBlockChain = useMemo(() => {
  //   return blockchainState.wallet.logged.value;
  // }, [blockchainState.wallet.logged.value]);

  // const loggedToRepBlockChain = useMemo(() => {
  //   return blockchainState.wallet.logged.value;
  // }, [blockchainState.wallet.logged.value]);
  //
  const [qrMessage, setQrMessage] = useState<string>();
  const [validityPeriod, setValidityPeriod] = useState<number | undefined>(undefined);

  useEffect(() => {
    // (async () => {
    //   await blockchainMethods.connect();
    //   console.log(getContainer<AppContainer>().arConnector.wallet.getAccountId());
    //   const key = await getContainer<AppContainer>().arConnector.wallet._keyStore.getKey(
    //     getContainer<AppContainer>().arConnector.config.networkId,
    //     getContainer<AppContainer>().arConnector.wallet.getAccountId()
    //   );
    //   if (!!key) {
    //     setAccessKey(key.getPublicKey().toString());
    //   }
    // })();

    const generateQRMessage = async () => {
      // @ts-ignore
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(RSA_PUBLIC_KEY);

      // format: <admin access key>|<community access key>|<account id>|<expire time>
      // Gen Message
      const suffix = ':testnet';

      const communityWalletAuth = localStorage.getItem(
        getContainer().bcConnector.config.contractId + getContainer().bcConnector.wallet.getAccountId() + suffix
      );
      if (!communityWalletAuth) {
        return;
      }

      const message = [
        communityWalletAuth,
        getContainer().bcConnector.wallet.getAccountId(),
        moment().unix() + 30,
      ].join('|');

      var encrypted = encrypt.encrypt(message);
      console.log('encrypt data', encrypted, ',\n data', message);

      setQrMessage(encrypted);
      setValidityPeriod(30);
    };

    generateQRMessage();
    const interval = setInterval(generateQRMessage, 30 * 1000);
    const intervalValidityPeriod = setInterval(() => {
      setValidityPeriod((old) => {
        if (!!old && old > 0) return old - 1;
        else if (old == 0) return 0;
        else return undefined;
      });
    }, 1 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(intervalValidityPeriod);
    };
  }, []);

  return {
    qrcodePageState: {
      isLoading,
      logged,
      qrMessage,
      validityPeriod,
      // loggedToARBlockChain,
      // loggedToRepBlockChain,
      // accountId,
    },
    qrcodePageMethods: {
      btnBackToHomeOnClick,
      btnConnectWalletOnClick,
      btnSwitchAccountOnClick,
      // btnConnectWalletToRepOnClick,
    },
  };
};
