import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useHeader = () => {
  const router = useRouter();

  const brandOnClick = useCallback(() => router.push('/'), [router]);

  return {
    headerState: {},
    headerMethods: {
      brandOnClick,
    },
  };
};
