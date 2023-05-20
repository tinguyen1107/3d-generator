import CustomAuth, { UX_MODE } from '@toruslabs/customauth';
import { getED25519Key } from '@toruslabs/openlogin-ed25519';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NearConfig, TorusConfig } from '../configs';
import { base_encode as baseEncode } from 'near-api-js/lib/utils/serialize';
import { KeyPair, PublicKey } from 'near-api-js/lib/utils/key_pair';
import { KeyPairEd25519 } from 'near-api-js/lib/utils';
import { getContainer } from '../core';
import { StorageKeys } from '../constants';
import { AuthApi } from '../apis/auth.api';
import { useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';

interface ITorusResponse {
  userInfo: { accessToken: string; typeOfLogin: `discord` | `google` };
  privateKey: string;
}

export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return Buffer.from(uint8Array).toString(`hex`);
}

export function getAccountIdFromPrivateKey(privateKey: string) {
  const { pk } = getED25519Key(privateKey);
  const pk58 = `ed25519:${baseEncode(pk)}`;
  const accountId = uint8ArrayToHexString(PublicKey.fromString(pk58).data);
  // const accountId = base32Encode(pk, 'RFC4648', { padding: false }).toLocaleLowerCase() + '.testnet';
  return accountId;
}

const torus = new CustomAuth({
  baseUrl: `${TorusConfig.baseUrl}`,
  redirectPathName: 'auth',
  network: TorusConfig.network as any,
  uxMode: UX_MODE.REDIRECT,
});

const loginAndRedirect = async ({ accountId, keypair }: { accountId: string; keypair: KeyPair }) => {
  await getContainer().bcConnector.wallet._keyStore.setKey(NearConfig.networkId, accountId, keypair);
  localStorage.setItem(StorageKeys.IS_USE_OAUTH, 'true');
  const currentUrl = new URL(window.location.origin + '/home');
  currentUrl.searchParams.set('contract_id', getContainer().bcConnector.config.contractId);
  currentUrl.searchParams.set('account_id', accountId);
  window.location.replace(currentUrl.toString());
};

export const useOAuthDirect = () => {
  const [torusLoading, setTorusLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState<boolean>();
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>();
  const toast = useToast();

  const registerForm = useForm<{
    accountId: string;
    publicKey: string;
    keypair: KeyPair;
  }>();

  const triggerLogin = useCallback(() => {
    torus.triggerLogin(TorusConfig.verifiers.google);
  }, []);

  const handleRegisterFormSubmit = useMemo(
    () =>
      registerForm.handleSubmit(async (data) => {
        setIsRegisterLoading(true);
        try {
          const accountId = data.accountId + '.testnet';
          const isSucess = await AuthApi.createAccount({
            accountId,
            publicKey: data.publicKey,
          });
          if (isSucess) await loginAndRedirect({ accountId, keypair: data.keypair });
          else
            toast({
              title: 'Account already exists, please enter another account id!',
              position: 'top',
              status: 'error',
              isClosable: true,
              duration: 3000,
            });
        } catch (error) {
          toast({
            title: 'Register failed!',
            position: 'top',
            status: 'error',
            isClosable: true,
            duration: 3000,
          });
        }
        setIsRegisterLoading(false);
      }),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        setTorusLoading(true);
        let res: ITorusResponse | null | {} = null;
        const info = await torus.getRedirectResult();
        res = info.result as ITorusResponse | {};

        if (!(`userInfo` in res)) {
          throw new Error(`Malformed Torus response, please report this to Rep.run team.`);
        }

        const userInfo = res;
        const privateKey = baseEncode(getED25519Key(res.privateKey).sk);
        const keypair = KeyPairEd25519.fromString(privateKey);
        const publicKey = keypair.getPublicKey().toString();
        const accountId = await AuthApi.getAccountIdByPublicKey({ publicKey });

        console.log('OAUTH DATA userInfo', userInfo);
        console.log('OAUTH privateKey', keypair.toString());
        console.log('OAUTH publicKey', publicKey);
        console.log('OAUTH accountId', accountId);

        if (accountId) {
          await loginAndRedirect({ accountId, keypair });
        } else {
          setIsNewUser(true);
          registerForm.setValue('publicKey', publicKey);
          registerForm.setValue('keypair', keypair);
        }
      } catch (err: unknown) {
        throw err;
      } finally {
        setTorusLoading(false);
      }
    })();
  }, []);

  return {
    oauthDirectState: {
      torusLoading,
      registerForm,
      isNewUser,
      isRegisterLoading,
    },
    oauthDirectMethods: {
      triggerLogin,
      handleRegisterFormSubmit,
    },
  };
};
