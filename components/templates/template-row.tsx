import React from 'react';
import { Td, Text, Box, Button } from '@chakra-ui/react';
import moment from 'moment';
import { Template } from '../../dtos';
import { TemplateApi } from '../../apis';
import { useQuery } from 'react-query';

const TemplateAction = ({ template }: { template: Template }) => {
  const title = React.useMemo(() => {
    switch (template.status) {
      case 'pending':
        return 'Train';
      case 'training':
        return 'Waiting...';
      case 'finished':
        return 'Re-Train';
    }
  }, [template.status]);

  return (
    <Button width="120px" colorScheme="blue" isDisabled={template.status == 'training'}>
      {title}
    </Button>
  );
};

export const TemplateRow: React.FunctionComponent<{ template: Template }> = ({ template }) => {
  // TODO: fetch training status each 5s
  const statusQuery = useQuery(["status", template.id], () => TemplateApi.getTemplateStatusById(template.id), { refetchInterval: 1000 * 5 })
  const status = React.useMemo(() => {
    if (!!statusQuery.data) return statusQuery.data;
    return template.status
  }, [statusQuery.data])

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
        <TemplateAction template={{ ...template, status }} />
      </Td>
    </>
  );
};
