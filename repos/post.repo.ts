import { CreatePostInput, PostApi } from '../apis';
import { LikeCache, PostCache, RePostCache } from '../cache';
import { FETCH_POSTS_LIMIT } from '../constants';
import { getContainer } from '../core';
import { GetListInput } from '../core/types';
import { DB } from '../db';
import { CommentCreateInput, CommentDto, CommentEditInput, PostDto, PostStatus } from '../dtos';
import { buildWhereQuery } from '../hooks';
import { AccountRepo } from './account.repo';

export class PostRepo {
  static async findPostById(postId?: string, status?: PostStatus, draftId?: string) {
    const response = await DB.client.post.db.find({
      skip: 0,
      limit: FETCH_POSTS_LIMIT,
      selector: buildWhereQuery({ filter: { postId, status, draftId } }, true),
    });
    return response?.docs[0];
  }

  static async removePostFromLocalDB(postId: string) {
    const deleteDoc = await this.findPostById(postId);
    await DB.client.post.db.remove(deleteDoc._id, deleteDoc._rev);
  }

  static async createPost(input: CreatePostInput): Promise<void> {
    if (input.arMode) {
      return PostApi.createPost(input);
    }
    const draftId = Date.now().toString();
    const dto: PostDto = {
      id: draftId,
      communityId: '',
      accountId: getContainer().bcConnector.wallet.getAccountId(),
      topic: {
        id: 'default',
        name: 'Default',
        description: '',
      },
      postType: {
        type: input.postType,
        post_id: input.postTypeValue,
      },
      media: {
        type: input.media,
        url: input.mediaValue,
      },
      title: input.title,
      body: '',
      time: Date.now(),
      blockHeight: 0,
      lastPostHeight: 0,
      status: PostStatus.DRAFT,
    };
    await DB.client.post.db.post(dto);
    PostApi.createPost({ ...input, body: draftId }).then(async () => {
      console.log('BGJOB: create post success');
      Promise.allSettled([this.removePostFromLocalDB(draftId), PostCache.cache()]);
    });
  }

  static async fetchBookmarks(accountId: string, filter: { offset?: number; limit?: number }): Promise<PostDto[]> {
    let posts = await PostApi.fetchBookmarks(accountId, filter);
    return posts;
  }

  static async addBookmark(postId: string) {
    return PostApi.addBookmark(postId);
  }

  static async removeBookmark(postId: string) {
    return PostApi.removeBookmark(postId);
  }

  static async repost(postId: string, onSucess: () => void) {
    const draftId = Date.now().toString();
    const dto: PostDto = {
      id: draftId,
      communityId: '',
      accountId: getContainer().bcConnector.wallet.getAccountId(),
      topic: {
        id: 'default',
        name: 'Default',
        description: '',
      },
      postType: {
        type: 'RePost',
        post_id: postId,
      },
      media: {
        type: 'Standard',
        url: '',
      },
      title: '',
      body: '',
      time: Date.now(),
      blockHeight: 0,
      lastPostHeight: 0,
      status: PostStatus.DRAFT,
    };
    await DB.client.post.db.post(dto);
    onSucess();
    PostApi.repost(postId).finally(async () => {
      await Promise.allSettled([this.removePostFromLocalDB(draftId), PostCache.cache()]);
      RePostCache.delete(postId);
      onSucess();
    });
  }

  static async undoRepost(repostId: string, originalPostId: string, onSucess: () => void) {
    await this.removePostFromLocalDB(repostId);
    onSucess();
    PostApi.undoRepost(repostId, originalPostId).finally(async () => {
      await Promise.allSettled([PostCache.cache()]);
      RePostCache.delete(originalPostId);
      onSucess();
    });
  }

  static async deletePost(data: { postId?: string; postOwner?: string; communityId?: string }) {
    await this.removePostFromLocalDB(data.postId!);
    return PostApi.deletePost(data);
  }

  static async fetchPost(postId: string) {
    return this.findPostById(postId);
  }

  static async fetchPostByDraftId(draftId: string) {
    return this.findPostById(undefined, undefined, draftId);
  }

  static async fetchPosts(payload: GetListInput): Promise<any[]> {
    const data = PostApi.fetchPosts(payload);
    return data;
  }

  static async fetchCommunityPost(communityId: string, postId: string) {
    let post = await PostApi.fetchCommunityPost(communityId, postId);
    return post;
  }

  static async fetchPostNumComments(postId: string) {
    return PostApi.fetchPostNumComments(postId);
  }

  static async fetchListLikedPosts(accountId: string) {
    let postIds = await AccountRepo.getLikedPostIds(accountId);

    LikeCache.forEach((value, key) => {
      let id = postIds.indexOf(key);
      if (id == -1 && value.type == 'UpVote') {
        postIds.push(key);
      }
      if (id != -1 && value.type == 'UnVote') {
        postIds = postIds.filter((postId) => postId != key);
      }
    });

    return PostApi.fetchPostsByIds(postIds);
  }

  static async fetchListCommunityPosts({
    communityId,
    offset,
    limit,
  }: {
    communityId: string;
    offset?: number;
    limit?: number;
  }) {
    let posts = await PostApi.fetchListCommunityPosts({
      communityId,
      offset,
      limit,
    });
    return posts;
  }

  static async getListPosts(input: GetListInput<PostDto>): Promise<PostDto[]> {
    const { docs } = await DB.client.post.db.find({
      ...input,
      selector: input.selector ?? {},
    });
    return docs;
  }

  static async fetchListComments(postId: string, offset: number, limit: number): Promise<CommentDto[]> {
    return PostApi.fetchListComments(postId, offset, limit);
  }

  static async upVotePost(postId: string): Promise<void> {
    return PostApi.upVotePost(postId);
  }

  static async unVotePost(postId: string): Promise<void> {
    return PostApi.unVotePost(postId);
  }

  static async getVotePost(postId: string): Promise<number> {
    return LikeCache.get(postId)?.count ?? PostApi.getVotePost(postId);
  }

  static async voteStatusPost(postId: string): Promise<any> {
    return LikeCache.get(postId) ?? PostApi.voteStatusPost(postId);
  }

  static async canRepost(postId: string): Promise<boolean> {
    const cache = RePostCache.get(postId);
    return cache !== undefined ? !cache : PostApi.canRepost(postId);
  }

  static async getRepostId(postId: string): Promise<string> {
    return PostApi.getRepostId(postId);
  }

  static async repostCount(postId: string): Promise<number> {
    const count = await PostApi.repostCount(postId);
    const cache = RePostCache.get(postId);
    if (cache === true) return count + 1;
    if (cache === false) return count - 1;
    return count;
  }

  static async quotePostCount(postId: string): Promise<number> {
    return PostApi.quotePostCount(postId);
  }

  static async createComment(input: CommentCreateInput) {
    return PostApi.createComment(input);
  }

  static async editComment(input: CommentEditInput) {
    return PostApi.editComment(input);
  }

  static async fetchAndCacheHotPostIds(): Promise<void> {
    return PostApi.fetchAndCacheHotPostIds();
  }

  static async fetchAndCacheTrendingPostIds(): Promise<void> {
    return PostApi.fetchAndCacheTrendingPostIds();
  }
}
