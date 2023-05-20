import { FETCH_POSTS_LIMIT, IPFS_BASE_URL } from '../constants';
import { getContainer } from '../core';
import { GetListInput, TransactionAction } from '../core/types';
import {
  CommentCreateInput,
  CommentDto,
  CommentEditInput,
  PostDto,
  PostMediaEnum,
  PostStatus,
  PostTypeEnum,
} from '../dtos';
import { RequestUtils } from '../utils';

enum ContractMethods {
  categories = 'categories',
  new_category = 'new_category',
  add_bookmark = 'add_bookmark',
  remove_bookmark = 'remove_bookmark',
  upvote = 'upvote',
  unvote = 'unvote',
  comment = 'comment',
  edit_comment = 'edit_comment',
  post = 'post',
  undo_repost = 'undo_repost',
  delete_post = 'delete_post',
  new_topic = 'new_topic',
  ///
  get_posts = 'get_posts',
  get_bookmarks = 'get_bookmarks',
  get_post_by_id = 'get_post_by_id',
  get_post_by_ids = 'get_post_by_ids',
  get_community_post_with_id = 'get_community_post_with_id',
  get_trending_posts = 'get_trending_posts',
  get_hot_posts = 'get_hot_posts',
  get_community_posts = 'get_community_posts',
  vote_status = 'vote_status',
  get_votes = 'get_votes',
  get_num_post_comments = 'get_num_post_comments',
  get_comments = 'get_comments',
  can_repost = 'can_repost',
  get_repost_id = 'get_repost_id',
  repost_count = 'repost_count',
  quote_post_count = 'quote_post_count',
}

export type CreatePostInput = {
  title: string;

  postType: PostTypeEnum;
  postTypeValue: string;
  media: PostMediaEnum;
  mediaValue: string;

  arMode: boolean;
  name: string;
  code: string;
  location: {
    lat: number;
    lng: number;
    label: string;
  };
  expired?: number;
  body?: string;
};

export const PostApi = Object.freeze({
  async createPost(input: CreatePostInput): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.post,
      args: {
        title: input.title,
        post_type: {
          type: input.postType || 'Standard',
          post_id: input.postTypeValue,
        },
        media: {
          type: input.media || 'Standard',
          url: input.mediaValue,
        },
        topic_id: 'default',
        body: input.body,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async addBookmark(postId: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.add_bookmark,
      args: {
        post_id: postId,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async removeBookmark(postId: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.remove_bookmark,
      args: {
        post_id: postId,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async upVotePost(postId: string): Promise<void> {
    await getContainer().bcConnector.callChangeMethod({
      methodName: ContractMethods.upvote,
      args: {
        post_id: postId,
      },
    });
  },
  async unVotePost(postId: string): Promise<void> {
    await getContainer().bcConnector.callChangeMethod({
      methodName: ContractMethods.unvote,
      args: {
        post_id: postId,
      },
    });
  },
  async createComment(input: CommentCreateInput): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.comment,
      args: {
        post_id: input.postId,
        body: input.body,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async editComment(input: CommentEditInput): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.edit_comment,
      args: {
        post_id: input.postId,
        comment_index: input.commentIndex,
        body: input.body,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async repost(postId: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.post,
      args: {
        title: '',
        post_type: {
          type: 'RePost',
          post_id: postId,
        },
        media: {
          type: 'Standard',
        },
        topic_id: 'default',
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async undoRepost(repostId: string, originalPostId: string): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.undo_repost,
      args: {
        repost_id: repostId,
        original_post_id: originalPostId,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  async deletePost({
    postId,
    postOwner,
    communityId,
  }: {
    postId?: string;
    postOwner?: string;
    communityId?: string;
  }): Promise<void> {
    const actions: TransactionAction[] = [];

    actions.push({
      methodName: ContractMethods.delete_post,
      args: {
        post_id: postId,
        post_owner: communityId ? undefined : postOwner,
        community_id: communityId,
      },
    });

    await RequestUtils.validateBeforeTransaction();
    await getContainer().bcConnector.transaction({
      actions,
      walletCallbackUrl: window.location.origin + '/account/' + getContainer().bcConnector.wallet.getAccountId(),
    });
  },
  ///
  async fetchPosts(payload: GetListInput): Promise<[PostDto]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_posts,
      args: payload,
    });
    return res.map((item: any) => mapToPost(item));
  },
  async fetchBookmarks(accountId: string, filter: { offset?: number; limit?: number }): Promise<PostDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_bookmarks,
      args: {
        account_id: accountId,
        from_index: filter?.offset ?? 0,
        limit: filter?.limit ?? 100,
      },
    });
    let posts = res.map((item: any) => {
      return mapToPost(item);
    });

    return posts;
  },
  async fetchPost(postId: string): Promise<PostDto> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_post_by_id,
      args: {
        post_id: postId,
      },
    });
    return mapToPost(res);
  },
  async fetchPostsByIds(postIds: string[]): Promise<PostDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_post_by_ids,
      args: {
        post_ids: postIds,
      },
    });
    return res.map((item: any) => mapToPost(item));
  },
  async fetchCommunityPost(communityId: string, postId: string) {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_community_post_with_id,
      args: {
        community_id: communityId,
        post_id: postId,
      },
    });
    return res.map((item: any) => mapToPost(item));
  },
  async fetchListCommunityPosts({
    communityId,
    offset,
    limit,
  }: {
    communityId: string;
    offset?: number;
    limit?: number;
  }): Promise<PostDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_community_posts,
      args: {
        community_id: communityId,
        from_index: offset ?? 0,
        limit: limit ?? FETCH_POSTS_LIMIT,
      },
    });
    return res.map((item: any): PostDto => mapToPost({ ...item, community_id: communityId }));
  },
  async voteStatusPost(postId: string): Promise<string> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.vote_status,
      args: {
        post_id: postId,
        account_id: getContainer().bcConnector.wallet.getAccountId(),
      },
    });
    return res;
  },
  async getVotePost(postId: string): Promise<number> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_votes,
      args: {
        post_id: postId,
      },
    });
    return res;
  },
  async canRepost(postId: string): Promise<boolean> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.can_repost,
      args: {
        post_id: postId,
        account_id: getContainer().bcConnector.wallet.getAccountId(),
      },
    });
    return res;
  },
  async getRepostId(postId: string): Promise<string> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_repost_id,
      args: {
        post_id: postId,
        account_id: getContainer().bcConnector.wallet.getAccountId(),
      },
    });
    return res;
  },
  async repostCount(postId: string): Promise<number> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.repost_count,
      args: {
        post_id: postId,
      },
    });
    return res;
  },
  async quotePostCount(postId: string): Promise<number> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.quote_post_count,
      args: {
        post_id: postId,
      },
    });
    return res;
  },
  async fetchListComments(postId: string, offset: number, limit: number): Promise<CommentDto[]> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_comments,
      args: {
        post_id: postId,
        from_index: offset,
        limit,
      },
    });
    return res.map((item: any) => ({
      ...item,
      body: IPFS_BASE_URL + item.body,
      time: Math.floor(Number.parseInt(item.time) / 1000000),
    }));
  },
  async fetchPostNumComments(postId: string): Promise<number> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_num_post_comments,
      args: {
        post_id: postId,
      },
    });
    return res;
  },
  async fetchAndCacheTrendingPostIds(): Promise<void> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_trending_posts,
      args: {},
    });
    localStorage.setItem('trending_post_ids', JSON.stringify(res.map((i: any) => i.post_id)));
  },
  async fetchAndCacheHotPostIds(): Promise<void> {
    const res = await getContainer().bcConnector.callViewMethod({
      methodName: ContractMethods.get_hot_posts,
      args: {},
    });
    localStorage.setItem('hot_post_ids', JSON.stringify(res.map((i: any) => i.post_id)));
  },
});

const mapToPost = (raw: any): PostDto => {
  let post = {
    id: raw.id,
    accountId: raw.account_id,
    communityId: raw.community_id,
    topic: {
      id: raw.topic.id,
      description: raw.topic.description,
      name: raw.topic.name,
    },
    postType: {
      type: raw.post_type.type,
      post_id: raw.post_type.post_id,
    },
    media: { type: raw.media.type, url: raw.media.url },
    title: raw.title,
    body: raw.body,
    time: Math.floor(Number.parseInt(raw.time) / 1000000),
    blockHeight: raw.block_height,
    lastPostHeight: raw.last_post_height,
    numLikes: undefined,
    numQuotes: undefined,
    numComments: undefined,
    status: PostStatus.ACTIVE,
  };

  return post;
};
