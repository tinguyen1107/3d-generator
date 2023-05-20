import { defaults } from 'pouchdb';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';
import { CachePrefixKeys } from '../constants';
import { SetAboutMeInput } from '../dtos';
import { AccountRepo } from '../repos';
import { AuthUtils } from '../utils';

export const useEditAboutMe = ({
  defaultValues,
  options,
}: {
  defaultValues?: SetAboutMeInput;
  options?: Omit<UseMutationOptions<void, unknown, SetAboutMeInput, unknown>, 'mutationFn'>;
} = {}) => {
  const editAboutMeForm = useForm<SetAboutMeInput>({
    defaultValues,
  });
  const resetForm = useCallback((defaultValues: SetAboutMeInput) => editAboutMeForm.reset(defaultValues), []);
  const editAboutMeMutation = useMutation((payload: SetAboutMeInput) => AccountRepo.updateProfile(payload), options);
  const queryClient = useQueryClient();

  const onSubmit = useMemo(
    () =>
      editAboutMeForm.handleSubmit(async (data: SetAboutMeInput) => {
        await AuthUtils.authCheckAndExec(async () => {
          try {
            await editAboutMeMutation.mutateAsync(data);
            queryClient.invalidateQueries([CachePrefixKeys.ACCOUNT]);
          } catch (error) {
            console.error(error);
          }
        });
      }),
    [editAboutMeForm]
  );

  return {
    editAboutMeState: {
      isLoading: editAboutMeMutation.isLoading,
      data: editAboutMeMutation.data,
      form: editAboutMeForm,
    },
    editAboutMeMethods: {
      onSubmit,
      resetForm,
    },
  };
};
