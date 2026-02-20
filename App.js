import { Center, OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import Checkbox from 'expo-checkbox';
import { THREE } from 'expo-three';
import { Suspense, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

function Model({ index, onAnimationNames, loop, freezeTpose, onBlenderCamera }) {
  const { scene, animations, cameras } = useGLTF(require('./assets/model5.glb'));
  const { actions, names } = useAnimations(animations, scene);
  const { set, size } = useThree();

  console.log({ cameras }, cameras.length)


  // console.log('cameras:', obj.cameras)
  // console.log('first camera:', obj.cameras[0])
  // scene.traverse((object) => console.log(object.isCamera))

  useEffect(() => {
    console.log('useEffect 1')
    if (cameras && cameras.length > 0) {
      const gblCamera = cameras[0];
      gblCamera.aspect = size.width / size.height;
      gblCamera.updateProjectionMatrix();
      set({ camera: gblCamera });
      onBlenderCamera(gblCamera);
    }
  }, [cameras, size, set]);

  useEffect(() => {
    onAnimationNames(names);
  }, []);

  useEffect(() => {
    console.log('useEffect 2')

    Object.values(actions).forEach(action => {
      action.stop();
    })

    if (!names[index]) return;

    console.log(THREE.AnimationClip.findByName(animations, 'Camera'));

    const current = actions[names[index]];
    if (current) {
      current.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      current.play();
    }

  }, [scene, animations, index, loop]);

  useEffect(() => {
    console.log('useEffect 3')

    if (freezeTpose) {
      Object.values(actions).forEach(action => {
        action.stop();
      })
    }

  }, [freezeTpose]);

  // scene.add(obj.cameras[0])
  console.log(scene)

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  )
}

export default function App() {
  const [animationNames, setAnimationNames] = useState([]);
  const [index, setIndex] = useState(-1);
  const [loop, setLoop] = useState(true);
  const [freezeTpose, setFreezeTpose] = useState(false);
  const [blenderCamera, setBlenderCamera] = useState(null);

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

  function onAnimationNamesHandler(names) {
    setAnimationNames(names);
  }

  function onBlenderCameraHandler(camera) {
    setBlenderCamera(camera);
    console.log('camera:', camera?.object)

  }

  function handleOnPrevious() {
    setFreezeTpose(false);
    let currentIndex = index;
    currentIndex = currentIndex === 0 ? 0 : currentIndex - 1;
    setIndex(currentIndex);
  }

  function handleOnNext() {
    setFreezeTpose(false);
    let currentIndex = index;
    currentIndex = currentIndex >= animationNames.length ? animationNames.length - 1 : currentIndex + 1;
    setIndex(currentIndex);
  }

  return (
    <>
      <View style={styles.container}>
        <Canvas onCreated={handlePixelStorei}>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 2, 2]} />
          <Suspense fallback={null}>
            <Model onAnimationNames={onAnimationNamesHandler} index={index} loop={loop} freezeTpose={freezeTpose} onBlenderCamera={onBlenderCameraHandler} />
          </Suspense>

          <OrbitControls />
        </Canvas>
        <Text style={[styles.text, { top: 30, left: 30 }]}>
          Animations: {animationNames.join(', ')}
        </Text>
        <Text style={[styles.text, { top: 50, left: 30 }]}>
          Current Animation: {index >= 0 ? animationNames[index] : 'T-pose'}
        </Text>
        <Text style={[styles.text, { top: 70, left: 30 }]}>
          Loop: {loop ? 'true' : 'false'}
        </Text>
        <Text style={[styles.text, { top: 90, left: 30 }]}>
          Freeze T-Pose: {freezeTpose ? 'true' : 'false'}
        </Text>
        <Text style={[styles.text, { top: 110, left: 30 }]}>
          Model has camera: {blenderCamera ? 'true' : 'false'}
        </Text>
        <View style={styles.buttonContainer}>
          <Button title='Freeze T-pose' onPress={() => setFreezeTpose(true)} />
          <Button title='Previous' onPress={handleOnPrevious} />
          <Button title='Next' onPress={handleOnNext} />
          <Checkbox value={loop} onValueChange={setLoop} color={loop ? '#4630EB' : undefined} />
          <Text>Loop</Text>
        </View>
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    position: 'absolute',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '30%'
  },
});

const cameraProps = {
  position: [0, 0, 3],
  fov: 60,
  near: 0.01,
  far: 1000,
};
