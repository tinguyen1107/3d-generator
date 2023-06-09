import React from 'react';
import { Td, Text, Box, Button, useToast } from '@chakra-ui/react';
import moment from 'moment';
import { Template, TemplateStatus } from '../../dtos';
import { TemplateApi } from '../../apis';
import { useQuery, useQueryClient } from 'react-query';
import { CachePrefixKeys } from '../../constants';
import { toastBaseConfig } from '../../utils';

const TemplateAction = ({ id, status }: { id: string; status: TemplateStatus }) => {
  const queryClient = useQueryClient();
  const toast = useToast()
  const title = React.useMemo(() => {
    switch (status) {
      case 'pending':
        return 'Train';
      case 'training':
        return 'Waiting...';
      case 'ready':
        return 'Delete';
    }
  }, [status]);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onClick = React.useCallback(async () => {
    setIsLoading(true);
    try {
      switch (status) {
        case 'pending':
          if (await TemplateApi.trainTemplate(id)) {
            toast({ ...toastBaseConfig, title: "Delete template successfully", status: "success" })
            queryClient.invalidateQueries([CachePrefixKeys.TEMPLATE_STATUS, id]);
          } else {
            toast({ ...toastBaseConfig, title: "Delete template failed", status: "error" })
          }
          break;
        case 'ready':
          if (await TemplateApi.deleteTemplate(id)) {
            toast({ ...toastBaseConfig, title: "Delete template successfully", status: "success" })
            queryClient.invalidateQueries([CachePrefixKeys.TEMPLATE_LIST, id]);
          } else {
            toast({ ...toastBaseConfig, title: "Delete template failed", status: "error" })
          }
          break;
        case 'training':
          // Do nothing
          break;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [id, status]);

  return (
    <Button width="120px" colorScheme="blue" isDisabled={status == 'training'} isLoading={isLoading} onClick={onClick}>
      {title}
    </Button>
  );
};

export const TemplateRow: React.FunctionComponent<{ template: Template }> = ({ template }) => {
  // TODO: fetch training status each 5s
  const statusQuery = useQuery(
    [CachePrefixKeys.TEMPLATE_STATUS, template.id],
    () => TemplateApi.getTemplateStatusById(template.id),
    { refetchInterval: 1000 * 5, enabled: template.status == 'training' }
  );
  const status = React.useMemo(() => {
    if (!!statusQuery.data) return statusQuery.data;
    return template.status;
  }, [statusQuery.data, template.status]);

  return (
    <>
      <Td>{template.name}</Td>
      <Td>
        <Box w="100px" p="5px 0" textAlign="center" bg="green.300" borderRadius="5px">
          <Text fontWeight="700" color="white">
            {status.toUpperCase()}
          </Text>
        </Box>
      </Td>
      <Td>{moment.unix(template.createdAt).format('HH:mm DD/MM/YYYY')}</Td>
      <Td>
        <TemplateAction id={template.id} status={status} />
      </Td>
    </>
  );
};
