import { useAccountList } from './atoms/use-account-list';

export const useRecommendFollow = () => {
  const {
    accountListState: { listAccountsQuery },
  } = useAccountList();

  return {
    recommendFollowState: {
      listAccountsQuery,
    },
  };
};
