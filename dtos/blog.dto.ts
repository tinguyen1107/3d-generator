export type BlogType = {
  type: 'RePost' | 'QuotePost' | 'Standard' | 'Reply' | 'Article' | 'ArticleComment';
  post_id?: string;
};

type Media = {
  type: 'Standard' | 'Image' | 'Video' | 'Gif';
  url?: string;
};

export type BlogDto = {
  id: string;
  accountId: string;
  communityId: string;
  topic: {
    id: string;
    name: string;
    description: string;
  };
  postType: BlogType;
  media: Media;
  title: string;
  body: string;
  time: number;
  blockHeight: number;
  lastPostHeight: number;
  numLikes?: number;
  numQuotes?: number;
  numComments?: number;
};

// export type CommentDto = {
//   owner: string;
//   time: number;
//   body: string;
// };
//
// export type CommentCreateInput = {
//   postId: string;
//   body: string;
// };
//
// export type CommentEditInput = {
//   postId: string;
//   commentIndex: number;
//   body: string;
// };
//
export enum BlogViewByEnum {
  NEW = 'new',
  HOT = 'hot',
  TRENDING = 'trending',
}

export enum BlogTypeEnum {
  IMAGE = 'Image',
  VIDEO = 'Video',
  STANDARD = 'Standard',
  REPOST = 'RePost',
  QUOTEPOST = 'QuotePost',
}
