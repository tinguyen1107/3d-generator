import { PostApi } from '../apis';
import { cacheDataList } from '../core/utils';
import { DB } from '../db';
import { PostStatus } from '../dtos';
import { PostRepo } from '../repos';

const LIMIT_PER_CACHE_HIT = 250;

export const PostCache = Object.freeze({
  async cache({ removeTemp }: { removeTemp?: boolean } = {}) {
    await Promise.all([PostRepo.fetchAndCacheHotPostIds(), PostRepo.fetchAndCacheTrendingPostIds()]);
    const dbClient = DB.client.post.db;
    await cacheDataList({
      dbClient,
      limitPerCacheHit: LIMIT_PER_CACHE_HIT,
      firstRecordQuery: {
        sort: [{ time: 'desc' }],
        selector: {
          time: { $exists: true },
          status: { $ne: PostStatus.DRAFT },
        },
      },
      fetchList: PostApi.fetchPosts,
      compareKey: 'id',
      removeTemp,
    });
    console.info('PostCache: cached!!');
  },
  async refresh() {
    const dbClient = DB.client.post.db;
    console.info('PostCache: refresh!!');
  },
});
