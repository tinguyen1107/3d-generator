import React from 'react';

export const useInfiniteScroll = () => {
  // Infinite scroll
  const [isFetchMoreData, setFetchMoreData] = React.useState<boolean>(false);

  const onScroll = React.useCallback(() => {
    const { scrollY } = window;
    if (scrollY > document.body.scrollHeight - window.innerHeight - 50) setFetchMoreData(true);
    else setFetchMoreData(false);
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return {
    infiniteScrollState: {
      isFetchMoreData,
    },
  };
};
