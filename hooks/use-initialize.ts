import { useEffect } from 'react';
import { useApp } from './atoms';

export const useInitialize = () => {
  const { appState } = useApp();

  useEffect(() => {
    appState.merge({
      loading: false,
      ready: true,
    });
  }, []);

  return {
    appState,
  };
};
