import React from 'react';
import { Td, Text, Tr, Box, Button } from '@chakra-ui/react';
import moment from 'moment';
import { Template } from '../../dtos';

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

export const TemplateRow = ({ template }: { template: Template }) => {
  // TODO: fetch training status each 10s

  return (
    <Tr>
      <Td>{template.name}</Td>
      <Td>
        <Box w="100px" p="5px 0" textAlign="center" bg="green.300" borderRadius="5px">
          <Text fontWeight="700" color="white">
            {template.status.toUpperCase()}
          </Text>
        </Box>
      </Td>
      <Td>{moment.unix(template.createdAt).format('HH:mm DD/MM/YYYY')}</Td>
      <Td>
        <TemplateAction template={template} />
      </Td>
    </Tr>
  );
};
