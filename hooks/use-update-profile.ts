import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import Quill from 'quill';
import { useToast } from '@chakra-ui/react';
import { getMessageFromExecutionError } from '../utils';
import { AccountProfileInput } from '../apis';
import { AccountState } from '../store';
import { useHookstate } from '@hookstate/core';
import { AccountRepo } from '../repos';
import { CachePrefixKeys } from '../constants';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateProfileForm = useForm<AccountProfileInput>();
  const [updateProfilePublishing, setCreatePostPublishing] = useState(false);
  const refQuill = useRef<Quill>();
  const toast = useToast();
  const accountState = useHookstate(AccountState);

  const handleUpdateProfileFormSubmit = useMemo(
    () =>
      updateProfileForm.handleSubmit(async (data: AccountProfileInput) => {
        setCreatePostPublishing(true);
        let action: string = '';

        try {
          action = 'Update Profile';
          Object.keys(data).forEach((key: string) => {
            // @ts-ignore
            if (data[key] === '') {
              // @ts-ignore
              delete data[key];
            }
          });

          console.log(action, ', Data: ', JSON.stringify(data, null, 2));
          // await AccountRepo.updateProfile(data);

          queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT, accountState.value.profile?.id]);

          updateProfileForm.reset();

          toast({
            title: action + ' successfully',
            position: 'bottom-left',
            status: 'success',
            isClosable: true,
            duration: 3000,
          });
        } catch (error: any) {
          console.error(error);
          const message = getMessageFromExecutionError(error.kind.ExecutionError);
          toast({
            title: action + ' failed',
            description: message,
            position: 'bottom-left',
            status: 'error',
            isClosable: true,
            duration: 3000,
          });
        } finally {
          setCreatePostPublishing(false);
        }
      }),
    []
  );

  return {
    refQuill,
    updateProfileForm,
    updateProfilePublishing,
    handleUpdateProfileFormSubmit,
  };
};
