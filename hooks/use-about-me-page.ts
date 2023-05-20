import { useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { useWalletAccountId } from '../core/hooks';
import { Optional } from '../core/types';
import { AccountRepo } from '../repos';
import { ModalUtils } from '../utils';

export const useAboutMePage = (props?: { accountId?: string }) => {
  const router = useRouter();
  const accountId = props?.accountId ?? (router.query?.accountId as Optional<string>);
  const { accountId: myAccountId } = useWalletAccountId();
  const { setColorMode } = useColorMode();

  const isOwner = useMemo(() => accountId === myAccountId, [accountId, myAccountId]);

  const accountQuery = useQuery([CachePrefixKeys.ACCOUNT, accountId], () => AccountRepo.fetchAccount(accountId!), {
    enabled: !!accountId,
  });

  const isShowBtnContactMe = useMemo(
    () => !!accountQuery.data?.about_me?.email && !isOwner,
    [accountQuery.data, isOwner]
  );

  const btnBackOnClick = useCallback(() => {
    router.push('https://rep.run');
  }, []);

  const btnEditOnClick = useCallback(() => {
    ModalUtils.editAboutMe.onOpen();
  }, []);

  const btnContactMeOnClick = useCallback(() => {
    console.log(`mailto:${accountQuery.data?.about_me?.email}`);
    window.open(`mailto:${accountQuery.data?.about_me?.email}`);
  }, [accountQuery.data]);

  const btnSocialLinkOnClick = useCallback((url?: string) => {
    if (url) {
      const newUrl = url.match(/^https?:/) ? url : '//' + url;
      window.open(newUrl, '_blank');
    }
  }, []);

  useEffect(() => {
    const colorMode = router.query?.colormode;
    if ((!!colorMode && colorMode == 'light') || colorMode == 'dark') setColorMode(colorMode);
  }, []);

  return {
    aboutMePageState: {
      accountId,
      isOwner,
      data: accountQuery.data,
      isLoading: accountQuery.isLoading,
      isShowBtnContactMe,
    },
    aboutMePageMethods: {
      btnBackOnClick,
      btnEditOnClick,
      btnContactMeOnClick,
      btnSocialLinkOnClick,
    },
  };
};
