import { useDisclosure, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useMutation } from 'react-query';
import { ReportRepo } from '../repos/report.repo';
import { ModalUtils, toastBaseConfig } from '../utils';

type ReportModalDataType = {
  optionFirstLayer: string | undefined;
  optionSecondLayer: string | undefined;
};

export const useReportModal = ({ accountId }: { accountId?: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [data, setData] = React.useState<ReportModalDataType>({} as any);

  const handleOpen = React.useCallback(() => {
    onOpen();
  }, []);

  const handleClose = React.useCallback(() => {
    setData({} as any);
    onClose();
  }, []);

  useEffect(() => {
    ModalUtils.reportModal.onOpen = handleOpen;
    ModalUtils.reportModal.onClose = handleClose;
  }, []);

  const submitReport = useMutation(
    async () => {
      const desc = `${data.optionFirstLayer}. ${data.optionSecondLayer}`;
      ReportRepo.report(window.location.pathname.split('/')[2], desc);
    },
    {
      onSuccess: () => {
        handleClose();
        toast({ title: 'Report successfully', status: 'success', ...toastBaseConfig });
      },
      onError: () => {
        toast({ title: 'Report failed', status: 'error', ...toastBaseConfig });
      },
    }
  );

  const selectFirstLayer = useCallback(
    (option: string) => setData({ optionFirstLayer: option, optionSecondLayer: undefined }),
    []
  );

  const selectSecondLayer = useCallback(
    (option: string) =>
      setData((old) => {
        return { ...old, optionSecondLayer: option };
      }),
    []
  );

  const goBackBtnOnClick = useCallback(
    () => setData({ optionFirstLayer: undefined, optionSecondLayer: undefined }),
    []
  );

  const submitReportFunction = useCallback(async () => {
    submitReport.mutate();
  }, [accountId]);

  return {
    data,
    isOpen,
    handleOpen,
    handleClose,
    isSubmiting: submitReport.isLoading,
    submitReport: submitReportFunction,
    selectFirstLayer,
    selectSecondLayer,
    goBackBtnOnClick,
  };
};
