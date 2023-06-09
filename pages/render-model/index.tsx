import React from 'react';
import Header from 'next/head';
import { Box, Button, IconButton } from '@chakra-ui/react';
import { Wrapper } from '../../components';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export default function HomePage() {
  const router = useRouter();
  const id = Number(router.query.id as string);
  const models = ["0a77cd2a91dfff53.obj"]

  return (
    <>
      <Header>
        <title>Zoogle</title>
      </Header>
      <Box w="100vw" h="100vh">
        <Wrapper link={models[id]} />
      </Box>
      {
        id > 0 && (
          <Box position="absolute" left="10px" top="50%" transform="translateY(-50%)">
            <IconButton colorScheme="blue" size="lg" aria-label='previous' icon={<FiArrowLeft />} onClick={() => {
              const url = new URL("render-model", window.location.origin);
              url.searchParams.append("id", `${id - 1}`);
              url.searchParams.append("models", models.join(','))
              router.push(url)
            }} />
          </Box>
        )
      }
      {
        id < models.length - 1 && (
          <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)">
            <IconButton colorScheme="blue" aria-label='previous' icon={<FiArrowRight />} onClick={() => {
              const url = new URL("render-model", window.location.origin);
              url.searchParams.append("id", `${id + 1}`);
              url.searchParams.append("models", models.join(','))
              router.push(url)
            }} />
          </Box>
        )
      }
      <Box position="absolute" left="10px" top="10px" >
        <Button colorScheme="blue" variant="outline" size="md" leftIcon={<FiArrowLeft />} onClick={() => router.push("/")} >Back</Button>
      </Box>
    </>
  );
}
