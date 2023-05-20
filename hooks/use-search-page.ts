import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { CachePrefixKeys, FETCH_POSTS_LIMIT } from '../constants';
import { AccountRepo, PostRepo } from '../repos';
import { PostState } from '../store';
import { buildWhereQuery, useInfiniteScroll, useIsAdmin } from './atoms';

export const useSearchPage = ({ keyword }: { keyword?: string }) => {
  const postState = useHookstate(PostState);
  const listPostsQuery = useInfiniteQuery(
    ['list_search_posts', postState.filter.value],
    ({ pageParam }) =>
      PostRepo.getListPosts({
        skip: pageParam?.skip || 0,
        limit: FETCH_POSTS_LIMIT,
        selector: buildWhereQuery({
          filter: {
            ...postState.value.filter,
            type: postState.value.filter.type,
            title: keyword,
          },
        }),
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < FETCH_POSTS_LIMIT) return undefined;
        const skip = pages.length * FETCH_POSTS_LIMIT;
        return {
          skip,
        };
      },
      keepPreviousData: true,
      enabled: !!keyword,
    }
  );

  const listAccountsQuery = useQuery(
    [CachePrefixKeys.ACCOUNT_SEARCH, keyword],
    () =>
      AccountRepo.fetchAccounts({
        keyword,
      }),
    { enabled: !!keyword }
  );

  const isAdmin = useIsAdmin();

  const {
    infiniteScrollState: { isFetchMoreData },
  } = useInfiniteScroll();
  useEffect(() => {
    if (isFetchMoreData && listPostsQuery.hasNextPage && !listPostsQuery.isFetchingNextPage) {
      listPostsQuery.fetchNextPage();
    }
  }, [isFetchMoreData]);

  return {
    searchPageState: {
      listAccountsQuery,
      listPostsQuery,
      isAdmin,
    },
  };
};
