import React from 'react';
import { Button, HStack, TableContainer, Tbody, Text, Th, Thead, Tr, Table } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { TemplateApi } from '../../apis';
import { TemplateRow } from './template-row';
import { useRouter } from 'next/router';


export const Templates = () => {
  const router = useRouter();
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
        <Button colorScheme="blue" onClick={() => router.push('create-template')}>
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
