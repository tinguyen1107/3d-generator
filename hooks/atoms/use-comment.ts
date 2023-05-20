import { useQuery } from 'react-query';
import { CommentDto } from '../../dtos';
import { PostRepo } from '../../repos';

const FETCH_COMMENT_LIMIT = 5;

export const useComment = (postId: string, currentCommentPage?: number) => {
  const getListCommentsQuery = useQuery<CommentDto[]>(
    ['list_comments', postId, currentCommentPage],
    () => {
      return PostRepo.fetchListComments(postId, (currentCommentPage! - 1) * FETCH_COMMENT_LIMIT, FETCH_COMMENT_LIMIT);
    },
    {
      enabled: !!postId && !!currentCommentPage,
    }
  );

  const getNumCommentsQuery = useQuery<number>(['num_comments', postId], () => PostRepo.fetchPostNumComments(postId), {
    enabled: !!postId,
  });

  return {
    commentState: {
      getListCommentsQuery,
      getNumCommentsQuery,
    },
  };
};
