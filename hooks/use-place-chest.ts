import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import Quill from 'quill';
import { useToast } from '@chakra-ui/react';
import { getMessageFromExecutionError, ModalUtils } from '../utils';
import { ChestRepo } from '../repos';
import { PlaceChestInput } from '../apis/chest.api';

export const usePlaceChest = () => {
  const queryClient = useQueryClient();
  const placeChestForm = useForm<PlaceChestInput>();
  const [createPostPublishing, setCreatePostPublishing] = useState(false);
  const refQuill = useRef<Quill>();
  const toast = useToast();

  const handlePlaceChestFormSubmit = useMemo(
    () =>
      placeChestForm.handleSubmit(async (data: PlaceChestInput) => {
        setCreatePostPublishing(true);

        console.log('Calling submit chest ', JSON.stringify(data, null, 2));
        const chestAction = data.action;
        let action: string = '';

        try {
          if (!data.name && data.name == '') data.name = 'No name';

          console.log('Data: ', JSON.stringify(data, null, 2));

          switch (chestAction) {
            case 'place':
              action = 'Place chest';
              await ChestRepo.placeChest(data);
              break;
            case 'replace':
              action = 'Replace chest';
              console.log('chest id ', data.id);
              if (!data.id) return;
              await ChestRepo.replaceChest(data.id, data);
              break;
          }

          queryClient.invalidateQueries('get_chests_by_account_id');
          ModalUtils.placeChest.onClose();
          placeChestForm.reset();

          toast({
            title: action + ' successfully',
            position: 'bottom-left',
            status: 'success',
            isClosable: true,
            duration: 3000,
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
    placeChestForm,
    createPostPublishing,
    handlePlaceChestFormSubmit,
  };
};
