export type PostTypeEnum = 'RePost' | 'QuotePost' | 'Standard' | 'Reply' | 'Article' | 'ArticleComment';
export type PostMediaEnum = 'Standard' | 'Image' | 'Video' | 'Gif';

export type PostType = {
  type: PostTypeEnum;
  post_id?: string;
};

export type Media = {
  type: PostMediaEnum;
  url?: string;
};

export enum PostStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  HIDE = 'hide',
}

export type PostDto = {
  id: string;
  accountId: string;
  communityId: string;
  topic: {
    id: string;
    name: string;
    description: string;
  };
  postType: PostType;
  media: Media;
  title: string;
  body: string;
  time: number;
  blockHeight: number;
  lastPostHeight: number;
  numLikes?: number;
  numQuotes?: number;
  numComments?: number;
  status: PostStatus;
};

export type CommentDto = {
  owner: string;
  time: number;
  body: string;
};

export type CommentCreateInput = {
  postId: string;
  body: string;
};

export type CommentEditInput = {
  postId: string;
  commentIndex: number;
  body: string;
};

export enum PostViewByEnum {
  NEW = 'new',
  HOT = 'hot',
  TRENDING = 'trending',
}
