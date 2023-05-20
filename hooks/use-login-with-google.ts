import CustomAuth, { UX_MODE } from '@toruslabs/customauth';
import { useCallback, useEffect, useState } from 'react';
import { TorusConfig } from '../configs';

const torus = new CustomAuth({
  baseUrl: TorusConfig.baseUrl,
  network: TorusConfig.network as any,
  redirectPathName: 'auth',
  uxMode: UX_MODE.REDIRECT,
});

export const useLoginWithGoogle = () => {
  const [torusLoading, setTorusLoading] = useState(true);
  const [isSignInWithGoogleLoading, setIsSignInWithGoogleLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setTorusLoading(true);
      await torus.init({
        skipSw: true,
      });
      setTorusLoading(false);
    })();
  }, []);

  const triggerLogin = useCallback(() => {
    setIsSignInWithGoogleLoading(true);
    torus.triggerLogin(TorusConfig.verifiers.google);
  }, []);

  return {
    loginWithGoogleState: {
      torusLoading,
      isSignInWithGoogleLoading,
    },
    loginWithGoogleMethods: {
      triggerLogin,
    },
  };
};
