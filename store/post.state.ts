import { hookstate, State } from '@hookstate/core';
import { Optional } from '../core/types';
import { PostStatus, PostViewByEnum } from '../dtos';

export type PostState = {
  filter: {
    viewBy?: Optional<PostViewByEnum>;
    accountId?: string;
    postId?: string;
    type?: string;
    typeValue?: string;
    media?: string;
    title?: string;
    status?: PostStatus;
    draftId?: string;
  };
};

export const PostState: State<PostState> = hookstate({
  filter: { viewBy: PostViewByEnum.NEW },
} as PostState);
