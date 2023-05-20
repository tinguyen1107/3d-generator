import { useDisclosure, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { FILE_LIMIT_SIZE } from '../constants';
import { SetAboutMeInput } from '../dtos';
import { IPFSUtils, ModalUtils, toastBaseConfig } from '../utils';
import { useEditAboutMe } from './use-edit-about-me';

export const useEditAboutModal = ({ defaultValues }: { defaultValues?: SetAboutMeInput }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { editAboutMeState, editAboutMeMethods } = useEditAboutMe({
    defaultValues,
    options: {
      onSuccess: () => {
        toast({
          title: 'Edit profile successfully',
          status: 'success',
          position: 'top',
        });
        onClose();
      },
      onError: () => {
        toast({
          title: 'Edit profile failed',
          status: 'error',
          position: 'top',
        });
      },
    },
  });

  // Avatar
  const avatarImageFileInputRef = useRef<any>();
  const editAvatarImageMutation = useMutation(async () => {
    if (avatarImageFileInputRef.current?.files) {
      const file = avatarImageFileInputRef.current.files[0];
      if (file.size > FILE_LIMIT_SIZE) {
        toast({
          title: 'Exceed file size limitation',
          status: 'error',
          ...toastBaseConfig,
        });
      } else {
        await IPFSUtils.uploadFileToIPFS({
          file,
          onSuccess: async (url: string) => {
            editAboutMeState.form.setValue('avatar', url, { shouldDirty: true });
          },
        });
      }
    }
  });
  const openAvatarImageFileImport = useCallback(async () => {
    avatarImageFileInputRef.current?.click();
  }, []);
  const handleAvatarImageFileImportChange = useCallback(async () => {
    editAvatarImageMutation.mutate();
  }, []);

  // Cover image
  const coverImageFileInputRef = useRef<any>();
  const editCoverImageMutation = useMutation(async () => {
    if (coverImageFileInputRef.current?.files) {
      const file = coverImageFileInputRef.current.files[0];
      if (file.size > FILE_LIMIT_SIZE) {
        toast({
          title: 'Exceed file size limitation',
          status: 'error',
          ...toastBaseConfig,
        });
      } else {
        await IPFSUtils.uploadFileToIPFS({
          file,
          onSuccess: async (url: string) => {
            editAboutMeState.form.setValue('cover_image', url, { shouldDirty: true });
          },
        });
      }
    }
  });
  const openCoverImageFileImport = useCallback(async () => {
    coverImageFileInputRef.current?.click();
  }, []);
  const handleCoverImageFileImportChange = useCallback(async () => {
    editCoverImageMutation.mutate();
  }, []);

  // Profile Image
  const profileImageFileInputRef = useRef<any>();
  const editProfileImageMutation = useMutation(async () => {
    if (profileImageFileInputRef.current?.files) {
      const file = profileImageFileInputRef.current.files[0];
      if (file.size > FILE_LIMIT_SIZE) {
        toast({
          title: 'Exceed file size limitation',
          status: 'error',
          ...toastBaseConfig,
        });
      } else {
        await IPFSUtils.uploadFileToIPFS({
          file,
          onSuccess: async (url: string) => {
            editAboutMeState.form.setValue('profile_image', url, { shouldDirty: true });
          },
        });
      }
    }
  });
  const openProfileImageFileImport = useCallback(async () => {
    profileImageFileInputRef.current?.click();
  }, []);
  const handleProfileImageFileImportChange = useCallback(async () => {
    editProfileImageMutation.mutate();
  }, []);

  useEffect(() => {
    ModalUtils.editAboutMe.onOpen = onOpen;
    ModalUtils.editAboutMe.onClose = onClose;
  }, []);

  return {
    editAboutMeModalState: {
      isOpen,
      avatarImageFileInputRef,
      coverImageFileInputRef,
      profileImageFileInputRef,
      isEditAvatarImageLoading: editAvatarImageMutation.isLoading,
      isEditCoverImageLoading: editCoverImageMutation.isLoading,
      isEditProfileImageLoading: editProfileImageMutation.isLoading,
      editAboutMeState,
    },
    editAboutMeModalMethods: {
      onOpen,
      onClose,
      editAboutMeMethods,
      openAvatarImageFileImport,
      handleAvatarImageFileImportChange,
      openCoverImageFileImport,
      handleCoverImageFileImportChange,
      openProfileImageFileImport,
      handleProfileImageFileImportChange,
    },
  };
};
