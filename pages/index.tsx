import React, { Suspense } from 'react';
import Header from 'next/head';
import { Box, Button, Center, Grid, GridItem, HStack, Input, Text } from '@chakra-ui/react';
// import { ModelRender } from '../components';
import { Canvas, useLoader } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ModelRender } from '../components';

export default function LandingPage() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [listItem, setListItem] = React.useState<string[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const handleOnSubmitButtonClick = React.useCallback(async () => {
    console.log('Submit: ', inputRef.current?.value);
    if (!!inputRef.current && !!inputRef.current.value) {
      const value = inputRef.current.value;

      const res = await blackbox(value);
      setListItem(res);

      // Clear input field
      inputRef.current.value = '';
    }
  }, []);

  const blackbox = React.useCallback(async (input: string) => {
    console.log(input);
    return ['1.obj', '2.obj', '3.obj', '4.obj'];
  }, []);

  return (
    <>
      <Header>
        <title>Homepage</title>
      </Header>
      {/* <HomeBackgroud /> */}
      <Box display="flex" flexDir="column" m="20px 40px" h="calc(100vh - 40px)">
        <Text fontSize="32px" fontWeight="700">
          3D Generator
        </Text>
        <Text fontSize="24px" fontWeight="700">
          Input any text
        </Text>
        <HStack mt="10px">
          <Input ref={inputRef} placeholder="Abc.." />
          <Button onClick={handleOnSubmitButtonClick}>Submit</Button>
        </HStack>
        <Box overflowY="auto">
          {listItem.length == 0 ? (
            <Center w="100%" h="100px">
              <Text>No Models found</Text>
            </Center>
          ) : (
            <Grid
              mt="15px"
              flex={1}
              w="100%"
              templateColumns={{
                base: 'repeat(1, minmax(300px, 1fr))',
                md: `repeat(${listItem.length / 2}, minmax(300px, 1fr))`,
              }}
              gap="10px"
            >
              {listItem.map((item, id) => (
                <GridItem key={`${id}_${item}`} h="150px">
                  <Box h="100%" border="solid 1px #bbb" borderRadius="10px" overflow="hidden">
                    <Box>
                      <Canvas>
                        <Suspense fallback={null}>
                          <ModelRender link={item} />
                          <ambientLight intensity={0.4} castShadow />
                          <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
                          <Environment preset="sunset" background={false} blur={1} />
                          <ContactShadows
                            resolution={512}
                            position={[0, 0, 0]}
                            opacity={1}
                            scale={10}
                            blur={2}
                            far={0.8}
                          />
                          <OrbitControls />
                        </Suspense>
                      </Canvas>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
}
