import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

function Model() {
  const { scene, animations } = useGLTF(require('./assets/model.glb'));

  useEffect(() => {
    console.log('scene loaded!')
  }, [scene, animations]);

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  )
}

export default function App() {

  //  EXGL: gl.pixelStorei() doesn't support this parameter yet!
  function handlePixelStorei(state) {
    let _gl = state.gl.getContext();
    const pixelStorei = _gl.pixelStorei.bind(_gl);
    _gl.pixelStorei = function (...args) {
      const [parameter] = args;
      switch (parameter) {
        case _gl.UNPACK_FLIP_Y_WEBGL:
          return pixelStorei(...args);
      }
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Canvas camera={cameraProps} onCreated={handlePixelStorei}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 2, 2]} />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const cameraProps = {
  position: [0, 0, 3],
  fov: 60,
  near: 0.01,
  far: 1000,
};
