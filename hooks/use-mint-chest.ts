import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import Quill from 'quill';
import { useToast } from '@chakra-ui/react';
import { getMessageFromExecutionError, ModalUtils, toastBaseConfig } from '../utils';
import { ChestRepo } from '../repos';

type MintChestInput = {
  chestId: string;
  accountId: string;
  doubleSelfieUrl: string;
};

export const useMintChest = () => {
  const queryClient = useQueryClient();
  const mintChestForm = useForm<MintChestInput>();
  const [mintChestPublishing, setMintChestPublishing] = useState(false);
  const refQuill = useRef<Quill>();
  const toast = useToast();

  const handleMintChestFormSubmit = useMemo(
    () =>
      mintChestForm.handleSubmit(async (data: MintChestInput) => {
        setMintChestPublishing(true);
        console.log('Send invitation ', JSON.stringify(data, null, 2));

        try {
          await ChestRepo.mintChest(data.chestId, data.accountId, data.doubleSelfieUrl);

          queryClient.invalidateQueries('get_chests_by_account_id');

          ModalUtils.placeChest.onClose();
          mintChestForm.reset();

          toast({
            title: 'Send invitation successfully',
            status: 'success',
            ...toastBaseConfig,
          });

          // router
          //     .push(createPostRedirect)
          /* .finally(() => */
          /*     localStorage.removeItem(CREATE_POST_REDIRECT) */
          /* ); */
        } catch (error: any) {
          console.error(error);
          const message = getMessageFromExecutionError(error.kind.ExecutionError);
          toast({
            title: 'Send invitation failed',
            description: message,
            status: 'error',
            ...toastBaseConfig,
          });
        } finally {
          setMintChestPublishing(false);
        }
      }),
    []
  );

  return {
    refQuill,
    mintChestForm,
    mintChestPublishing,
    handleMintChestFormSubmit,
  };
};
