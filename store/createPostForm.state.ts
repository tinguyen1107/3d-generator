import { hookstate, State } from '@hookstate/core';
import { Optional } from '../core/types';
import { PostType } from '../dtos';

export type CreatePostFormState = {
  postType: PostType;
};

export const CreatePostFormState: State<CreatePostFormState> = hookstate({} as CreatePostFormState);
