import { CreatePostInput, PostApi } from '../apis';
import { FETCH_POSTS_LIMIT } from '../constants';
import { GetListInput } from '../core/types';
import { DB } from '../db';
import { CommentCreateInput, CommentDto, CommentEditInput, PostDto, BlogDto } from '../dtos';
import { buildWhereQuery } from '../hooks';
import { AccountRepo } from './account.repo';

export class BlogRepo {
  static async findBlogById(postId: string) {
    const response = await DB.client.post.db.find({
      skip: 0,
      limit: FETCH_POSTS_LIMIT,
      selector: buildWhereQuery({ filter: { postId } }),
    });
    return response?.docs[0];
  }

  static async removeBlogFromLocalDB(postId: string) {
    const deleteDoc = await this.findBlogById(postId);
    await DB.client.post.db.remove(deleteDoc._id, deleteDoc._rev);
  }
  static async createPost(input: CreatePostInput): Promise<void> {
    return PostApi.createPost(input);
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

  static async repost(postId: string) {
    return PostApi.repost(postId);
  }

  static async undoRepost(repostId: string, originalPostId: string) {
    await this.removeBlogFromLocalDB(repostId);
    return PostApi.undoRepost(repostId, originalPostId);
  }

  static async deletePost(data: { postId?: string; postOwner?: string; communityId?: string }) {
    await this.removeBlogFromLocalDB(data.postId!);
    return PostApi.deletePost(data);
  }

  static async fetchPost(postId: string) {
    return this.findBlogById(postId);
  }

  static async fetchBlogs(payload: GetListInput): Promise<any[]> {
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
    const postIds = await AccountRepo.getLikedPostIds(accountId);
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
    return PostApi.getVotePost(postId);
  }

  static async voteStatusPost(postId: string): Promise<string> {
    return PostApi.voteStatusPost(postId);
  }

  static async canRepost(postId: string): Promise<boolean> {
    return PostApi.canRepost(postId);
  }

  static async repostCount(postId: string): Promise<number> {
    return PostApi.repostCount(postId);
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
