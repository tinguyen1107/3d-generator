import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Suspense } from 'react';
import { Box, Center, Text } from '@chakra-ui/react';

// export const ModelRender: React.FunctionComponent<{ link: string }> = ({ link }) => {
export const ModelRender = ({ link }: { link: string }) => {
  const obj = useLoader(OBJLoader, link);
  return <primitive object={obj} scale={1} />;

  // return (
  //   <Center>
  //     <Text> Hello</Text>
  //   </Center>
  // );
  // return (
  //   <Box>
  //     <Canvas>
  //       <Suspense fallback={null}>
  //         <primitive object={obj} scale={1} />
  //         <ambientLight intensity={0.4} castShadow />
  //         <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
  //         <Environment preset="sunset" background={false} blur={1} />
  //         <ContactShadows resolution={512} position={[0, 0, 0]} opacity={1} scale={10} blur={2} far={0.8} />
  //         <OrbitControls />
  //       </Suspense>
  //     </Canvas>
  //   </Box>
  // );
};
