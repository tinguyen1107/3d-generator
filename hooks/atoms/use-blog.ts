import { useHookstate } from '@hookstate/core';
import { useInfiniteQuery } from 'react-query';
import { CachePrefixKeys, FETCH_POSTS_LIMIT } from '../../constants';
import { PostViewByEnum } from '../../dtos';
import { PostRepo } from '../../repos';
import { AppState, PostState } from '../../store';

const buildWhereQuery = (payload: PostState): PouchDB.Find.Selector => {
  const hotPostIdsStr = localStorage.getItem('hot_post_ids');
  const trendingPostIdsStr = localStorage.getItem('trending_post_ids');
  const hotPostIds = hotPostIdsStr ? JSON.parse(hotPostIdsStr) : [];
  const trendingPostIds = trendingPostIdsStr ? JSON.parse(trendingPostIdsStr) : [];
  const selector: PouchDB.Find.Selector = {
    $and: [
      {
        time: { $exists: true },
      },
      {
        accountId: payload.filter.accountId ? { $eq: payload.filter.accountId } : undefined,
      },
      {
        id: payload.filter.postId
          ? { $eq: payload.filter.postId }
          : payload.filter.viewBy === PostViewByEnum.HOT
            ? { $in: hotPostIds }
            : payload.filter.viewBy === PostViewByEnum.TRENDING
              ? { $in: trendingPostIds }
              : undefined,
      },
      {
        'postType.type': 'Article',
      },
      {
        'postType.post_id': payload.filter.typeValue ? payload.filter.typeValue : undefined,
      },
      {
        'media.type': payload.filter.media ? payload.filter.media : undefined,
      },
      {
        title: payload.filter.title ? { $regex: RegExp(payload.filter.title, 'i') } : undefined,
      },
    ],
  };

  return selector;
};

const buildSortQuery = (payload: PostState): Array<string | { [propName: string]: 'asc' | 'desc' }> | undefined => {
  const sort: Array<string | { [propName: string]: 'asc' | 'desc' }> | undefined = [];

  switch (payload.filter.viewBy) {
    case PostViewByEnum.NEW:
      sort.push({ time: 'desc' });
      break;
    case PostViewByEnum.HOT:
      sort.push({ time: 'desc' });
      break;
    case PostViewByEnum.TRENDING:
      sort.push({ time: 'asc' });
      break;

    default:
      break;
  }

  return sort;
};

export const useBlog = (filter?: PostState) => {
  const postState = useHookstate(PostState);
  const appState = useHookstate(AppState);

  const postFilter = {
    filter: { ...postState.value.filter, ...filter?.filter },
  };

  const listPostsQuery = useInfiniteQuery(
    [CachePrefixKeys.LIST_BLOGS, postFilter.filter.viewBy],
    ({ pageParam }) => {
      const skip = pageParam?.skip || 0;
      return PostRepo.getListPosts({
        skip,
        limit: FETCH_POSTS_LIMIT,
        selector: buildWhereQuery(postFilter),
        sort: buildSortQuery(postFilter),
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < FETCH_POSTS_LIMIT) return undefined;
        const skip = pages.length * FETCH_POSTS_LIMIT;
        return {
          skip,
        };
      },
      keepPreviousData: true,
      enabled: appState.value.ready,
    }
  );

  return {
    listPostsState: {
      listPostsQuery,
    },
    listPostsMethods: {},
  };
};
