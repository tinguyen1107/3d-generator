import React from 'react';
import { IconButton, Box, HStack, VStack } from '@chakra-ui/react';
import { FiGithub, FiPlus } from 'react-icons/fi';
import { ImLab } from 'react-icons/im';
import { ScreenId } from '../dtos';
import { useRouter } from 'next/router';
import { ModalUtils } from '../utils';


type LayoutProps = {
  children: React.ReactNode;
  isAlertWhenNavigate?: boolean;
};

export const Layout: React.FunctionComponent<LayoutProps> = ({ children, isAlertWhenNavigate = false }) => {
  const router = useRouter();
  const navigate = React.useCallback(
    (moveTo: ScreenId) => {
      if (isAlertWhenNavigate) {
        ModalUtils.warning.onOpen({ continue: () => router.push(moveTo) });
        return;
      }
      router.push(moveTo)
    },
    [isAlertWhenNavigate]
  );

  React.useEffect(() => {
    if (isAlertWhenNavigate) {
      const alertUser = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ''
      }
      window.addEventListener('beforeunload', alertUser)
      return () => {
        window.removeEventListener('beforeunload', alertUser)
      }
    }
  }, [isAlertWhenNavigate])


  return (
    <Box
      sx={{
        '--container-max-width': '1116px',
      }}
    >
      <HStack spacing="0">
        <VStack bg="#0002" h="100vh" p="12px"> {/* 64px */}
          <IconButton onClick={() => navigate('/')} aria-label="Play with model" icon={<FiGithub />} />
          <IconButton onClick={() => navigate('templates')} aria-label="Training area" icon={<ImLab />} />
          <IconButton onClick={() => navigate('create-template')} aria-label="Training area" icon={<FiPlus />} />
        </VStack>
        <Box flex="1" display="flex" flexDir="column" p="20px 40px" h="100vh" w="calc(100vw - 64px)">
          {children}
        </Box>
      </HStack>
    </Box>
  );
};
