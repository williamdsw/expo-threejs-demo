import { Center, OrbitControls, useGLTF } from '@react-three/drei/native';
import { Suspense } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';

function Model() {
  const { scene } = useGLTF(require('./assets/model.glb'));
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
        <Canvas style={{ flex: 1 }} onCreated={handlePixelStorei}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow
          />
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