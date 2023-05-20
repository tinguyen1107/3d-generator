import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useLayout = () => {
  const router = useRouter();

  const accountId = useMemo(() => router.query.accountId as string, [router.query.accountId]);

  return {
    accountLayoutState: {
      accountId,
    },
    accountLayoutMethods: {},
  };
};
