import { Center, Environment, useAnimations, useGLTF } from '@react-three/drei/native';
import Checkbox from 'expo-checkbox';
import { THREE } from 'expo-three';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';


function Model({ index, onAnimationNames, loop, freezeTpose, onBlenderCamera, setIsPlaying }) {
  const { scene, animations, cameras } = useGLTF(require('./assets/model5.glb'));
  const { actions, names, mixer } = useAnimations(animations, scene);
  const { set, size } = useThree();

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

    setIsPlaying(true);

    const current = actions[names[index]];
    if (current) {
      current.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      current.clampWhenFinished = !loop;
      current.reset().play();
    }

    const handleFinished = (e) => {
      if (e.action === current) {
        console.log('finished');
        setIsPlaying(false);
      }
    };

    mixer.addEventListener('finished', handleFinished);

    return () => {
      mixer.removeEventListener('finished', handleFinished);
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


  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  )
}

function OrbitCamera({ orbit }) {
  const { camera } = useThree();
  useFrame(() => {
    const { theta, phi, radius } = orbit.current;
    camera.position.x = radius * Math.sin(theta) * Math.cos(phi)
    camera.position.y = radius * Math.sin(phi)
    camera.position.z = radius * Math.cos(theta) * Math.cos(phi)
    camera.lookAt(0, 0, 0)
  });

  return null;
}

export default function App() {
  const [animationNames, setAnimationNames] = useState([]);
  const [index, setIndex] = useState(-1);
  const [loop, setLoop] = useState(true);
  const [freezeTpose, setFreezeTpose] = useState(false);
  const [blenderCamera, setBlenderCamera] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const orbit = useRef({
    theta: 0,
    phi: 0,
    radius: 5
  });

  const start = useRef({ theta: 0, phi: 0 });
  const startRadius = useRef(orbit.current.radius)

  const rotateGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .runOnJS(true).onBegin(() => {
      console.log('pan begin');
      start.current.theta = orbit.current.theta;
      start.current.phi = orbit.current.phi;
    }).onUpdate((e) => {
      console.log('pan update');
      // horizontal swipe → rotate around Y
      orbit.current.theta =
        start.current.theta + e.translationX * 0.005

      // vertical swipe → tilt up/down
      orbit.current.phi =
        start.current.phi + e.translationY * 0.005

      // clamp vertical rotation
      orbit.current.phi = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, orbit.current.phi)
      )
    });

  const pinchGesture = Gesture.Pinch()
    .runOnJS(true)
    .onBegin(() => {
      console.log('pinch onBegin')
      startRadius.current = orbit.current.radius;
    })
    .onUpdate((e) => {
      console.log('pinch onUpdate')
      const nextRadius = startRadius.current / e.scale

      // clamp zoom limits
      orbit.current.radius = Math.max(
        2,     // minimum zoom
        Math.min(10, nextRadius) // maximum zoom
      )
    });

  const gesture = Gesture.Simultaneous(rotateGesture, pinchGesture);


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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Canvas style={{ flex: 1 }} camera={{ position: [0, 0, 5], fov: 50 }} onCreated={handlePixelStorei}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} />
            <Suspense fallback={null}>
              <OrbitCamera orbit={orbit} />
              <Model
                onAnimationNames={onAnimationNamesHandler}
                index={index}
                loop={loop}
                freezeTpose={freezeTpose}
                onBlenderCamera={onBlenderCameraHandler}
                setIsPlaying={setIsPlaying}
              />
            </Suspense>

            <Environment preset="warehouse" background />

            {/* <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} /> */}
          </Canvas>

          <GestureDetector gesture={gesture}>
            <View
              style={
                StyleSheet.absoluteFillObject
              }
            />
          </GestureDetector>
        </GestureHandlerRootView>


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
          <Button title='Test' disabled={isPlaying} onPress={() => console.log('hello!')} />

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
    width: '40%'
  },
});

const cameraProps = {
  position: [0, 0, 3],
  fov: 60,
  near: 0.01,
  far: 1000,
};
