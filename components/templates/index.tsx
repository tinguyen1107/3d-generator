import React from 'react';
import { Button, HStack, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Table, Box } from '@chakra-ui/react';
import moment from 'moment';

type Template = {
  id: string;
  name: string;
  status: TemplateStatus;
  createdAt: number;
};

type TemplateStatus = 'pending' | 'training' | 'running' | 'ready';

export const Templates = () => {
  const data: Template[] = [
    {
      id: 'template_01',
      name: 'test 01',
      status: 'running',
      createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
    },
    {
      id: 'template_02',
      name: 'test 02',
      status: 'running',
      createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
    },
    {
      id: 'template_03',
      name: 'test 03',
      status: 'running',
      createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
    },
  ];

  return (
    <>
      <HStack w="100%" justify="space-between">
        <Text fontSize="36px" fontWeight="700">
          Zoogle | Templates
        </Text>
        <Button>Create new template</Button>
      </HStack>
      <TableContainer mt="20px">
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Created Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((e) => (
              <Tr>
                <Td>{e.name}</Td>
                <Td>
                  <Box p="5px" bg="green.300" w="fit-content" borderRadius="5px">
                    <Text fontWeight="800" color="white">
                      {e.status.toUpperCase()}
                    </Text>
                  </Box>
                </Td>
                <Td>{moment.unix(e.createdAt).format('HH:mm DD/MM/YYYY')}</Td>
                <Td>
                  <TemplateAction template={e} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const TemplateAction = ({ template }: { template: Template }) => {
  const title = React.useMemo(() => {
    switch (template.status) {
      case 'pending':
        return 'Train';
      case 'training':
        return 'Pause';
      case 'ready':
        return 'Enable';
      case 'running':
        return 'Disable';
    }
  }, [template.status]);

  return <Button>{title}</Button>;
};
