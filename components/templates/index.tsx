import React from 'react';
import { Button, HStack, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Table, Box } from '@chakra-ui/react';
import moment from 'moment';
import { ScreenId } from '../../pages';

type Template = {
  id: string;
  name: string;
  status: TemplateStatus;
  createdAt: number;
};

type TemplateStatus = 'pending' | 'training' | 'finished';

interface TemplatesProps {
  router: (id: ScreenId) => void;
}

export const Templates = ({ router }: TemplatesProps) => {
  const data: Template[] = [
    {
      id: 'template_01',
      name: 'test 01',
      status: 'pending',
      createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
    },
    {
      id: 'template_02',
      name: 'test 02',
      status: 'finished',
      createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
    },
    {
      id: 'template_03',
      name: 'test 03',
      status: 'training',
      createdAt: moment('11/05/2023 15:12', 'DD/MM/YYYY HH:mm').unix(),
    },
  ];

  return (
    <>
      <HStack w="100%" justify="space-between">
        <Text fontSize="36px" fontWeight="700">
          Zoogle | Templates
        </Text>
        <Button onClick={() => router('create-template')}>Create new template</Button>
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
            {data.map((e) => (
              <Tr>
                <Td>{e.name}</Td>
                <Td>
                  <Box w="100px" p="5px 0" textAlign="center" bg="green.300" borderRadius="5px">
                    <Text fontWeight="700" color="white">
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

// TODO: fetch training status each 10s

const TemplateAction = ({ template }: { template: Template }) => {
  const title = React.useMemo(() => {
    switch (template.status) {
      case 'pending':
        return 'Train';
      case 'training':
        // TODO:
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
