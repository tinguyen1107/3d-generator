import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AccountRepo } from '../../repos';

export const useAccountList = () => {
  const listAccountsQuery = useQuery(['list_accounts'], () => AccountRepo.fetchAccountsWithNumPosts({ limit: 100 }));

  return {
    accountListState: {
      listAccountsQuery,
    },
    followMethods: {},
  };
};
