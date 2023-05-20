import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

export const useSearch = () => {
  const searchInputRef = React.useRef<any>();
  const router = useRouter();

  const handleSearchBtnClick = useCallback(() => {
    const keyword = searchInputRef.current?.value.trim();
    if (keyword) {
      router.push({
        pathname: '/search/[keyword]',
        query: {
          keyword,
        },
      });
    }
  }, []);

  const handleSearchInputEnter = useCallback((e: any) => {
    if (e.key === 'Enter') {
      const keyword = searchInputRef.current?.value.trim();
      if (keyword) {
        router.push(`/search/${keyword}`);
      }
    }
  }, []);

  return {
    searchInputRef,
    handleSearchBtnClick,
    handleSearchInputEnter,
  };
};
