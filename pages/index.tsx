import React from 'react';
import Header from 'next/head';
import { Box, IconButton, HStack, VStack, Text } from '@chakra-ui/react';
import { Playround, Templates } from '../components';
import { FiGithub } from 'react-icons/fi';
import { ImLab } from 'react-icons/im';

type ScreenId = 'playround' | 'templates';

export default function HomePage() {
  const [screenId, setScreenId] = React.useState<ScreenId>('playround');

  return (
    <>
      <Header>
        <title>Zoogle</title>
      </Header>
      <HStack gap="0">
        <VStack bg="#0002" h="100vh" p="12px">
          <IconButton onClick={() => setScreenId('playround')} aria-label="Play with model" icon={<FiGithub />} />
          <IconButton onClick={() => setScreenId('templates')} aria-label="Training area" icon={<ImLab />} />
        </VStack>
        <Box flex="1" display="flex" flexDir="column" p="20px 40px" h="100vh">
          {(() => {
            switch (screenId) {
              case 'playround':
                return <Playround />;
              case 'templates':
                return <Templates />;
            }
          })()}
        </Box>
      </HStack>
    </>
  );
}
