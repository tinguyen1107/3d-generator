import React, { useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Box3, Vector3 } from 'three';

export const Wrapper = ({ link }: { link: string }) => {
  const obj = useLoader(OBJLoader, link);
  useEffect(() => {
    console.log(link);
    const boundingBox = new Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject(obj);
    const center = boundingBox.getCenter(new Vector3(0, 0, 0));

    const size = boundingBox.getSize(new Vector3(0, 0, 0));
    console.log(boundingBox, center, size);
  }, [obj]);

  return (
    <Canvas
      shadows
      camera={{
        zoom: 5,
        view: {
          enabled: true,
          offsetX: 0,
          offsetY: -1800,
          fullWidth: 4096,
          fullHeight: 4096,
          width: 4096,
          height: 4096,
        },
      }}
    >
      <Suspense fallback={null}>
        <primitive object={obj} scale={1} />
        <ambientLight intensity={0.4} castShadow />
        <spotLight intensity={0.9} angle={0.1} penumbra={0} position={[30, 100, 25]} castShadow />
        <Environment preset="dawn" background={false} blur={1} />
        <ContactShadows resolution={512} position={[0, 0, 0]} opacity={1} scale={10} blur={2} far={20} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};
