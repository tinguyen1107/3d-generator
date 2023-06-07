import React from 'react';
import { Box, Button, HStack, TableContainer, Tbody, Text, Th, Thead, Tr, Table } from '@chakra-ui/react';
import { ScreenId } from '../../pages';
import { useQuery } from 'react-query';
import { TemplateApi } from '../../apis';
import { TemplateRow } from './template-row';

interface TemplatesProps {
  router: (id: ScreenId) => void;
}

export const Templates = ({ router }: TemplatesProps) => {
  const templateListQuery = useQuery(['template-list'], () => TemplateApi.getTemplates());
  const templates = React.useMemo(() => {
    if (!!templateListQuery.data) return templateListQuery.data;
    else return [];
  }, [templateListQuery.data?.length]);

  return (
    <>
      <HStack w="100%" justify="space-between">
        <Text fontSize="36px" fontWeight="700">
          Zoogle | Templates
        </Text>
        <Button colorScheme="blue" onClick={() => router('create-template')}>
          Create new template
        </Button>
      </HStack>
      <TableContainer mt="20px">
        <Table variant="striped" colorScheme="blackAlpha">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Created Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {templates.map((e, id) => (
              <Tr key={id}>
                < TemplateRow template={e} />
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
