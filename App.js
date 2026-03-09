import { Center, Environment, useAnimations, useGLTF, useHelper } from '@react-three/drei/native';
import Checkbox from 'expo-checkbox';
import { THREE } from 'expo-three';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { DirectionalLightHelper, PointLightHelper } from 'three';
import Light from './components/Light';
import Model from './components/Model';
import InfoContainer from './components/InfoContainer';
import ButtonContainer from './components/ButtonContainer';
import { canvasOnCreated, glProps } from './helpers/CanvasHelper';
import OrbitCamera from './components/OrbitCamera';
import createGestures from './helpers/GestureHelper';


const cameraProps = { position: [0, 0, 5], fov: 50 }

export default function App() {
  const [animationNames, setAnimationNames] = useState([]);
  const [index, setIndex] = useState(-1);
  const [loop, setLoop] = useState(false);
  const [freezeTpose, setFreezeTpose] = useState(false);
  const [blenderCamera, setBlenderCamera] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(0);

  // '../assets/models/model.glb' - 
  // '../assets/models/ANI_Bengala.glb' - 
  // '../assets/models/teste.glb' - 
  // '../assets/models/SapoActionsNovo (1).glb' - 
  // '../assets/models/SapoTake0012.glb' - 
  // '../assets/models/Sapo.glb' - 
  // '../assets/models/Sapo_alpha.glb' - 
  // '../assets/models/Sapo 1.glb' - 
  // '../assets/models/CubeLight3.glb' - 
  // '../assets/models/TesteLuz 2.glb' - 
  const modelPath = '../assets/models/SapoTake0012.glb';

  function onAnimationNamesHandler(names) {
    setAnimationNames(names);
    if (names.length > 0) {
      setIndex(0)
    }
  }

  function onToggleInfoHandler() {
    setShowInfo(!showInfo);
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

  const orbit = useRef({
    theta: 0,
    phi: 0,
    radius: 5
  });

  const start = useRef({ theta: 0, phi: 0 });
  const startRadius = useRef(orbit.current.radius)

  const myGesture = createGestures(orbit, start, startRadius, isPlaying);



  // const rotateGesture = Gesture.Pan()
  //   .enabled(!isPlaying)
  //   .minPointers(1)
  //   .maxPointers(1)
  //   .runOnJS(true).onBegin(() => {
  //     console.log('pan begin');
  //     start.current.theta = orbit.current.theta;
  //     start.current.phi = orbit.current.phi;
  //   }).onUpdate((e) => {
  //     console.log('pan update');
  //     // horizontal swipe → rotate around Y
  //     orbit.current.theta =
  //       start.current.theta + e.translationX * 0.005

  //     // vertical swipe → tilt up/down
  //     orbit.current.phi =
  //       start.current.phi + e.translationY * 0.005

  //     // clamp vertical rotation
  //     orbit.current.phi = Math.max(
  //       -Math.PI / 2 + 0.1,
  //       Math.min(Math.PI / 2 - 0.1, orbit.current.phi)
  //     )
  //   });

  // const pinchGesture = Gesture.Pinch()
  //   .enabled(!isPlaying)
  //   .runOnJS(true)
  //   .onBegin(() => {
  //     console.log('pinch onBegin')
  //     startRadius.current = orbit.current.radius;
  //   })
  //   .onUpdate((e) => {
  //     console.log('pinch onUpdate')
  //     const nextRadius = startRadius.current / e.scale

  //     // clamp zoom limits
  //     orbit.current.radius = Math.max(
  //       2,     // minimum zoom
  //       Math.min(10, nextRadius) // maximum zoom
  //     )
  //   });

  // const gesture = Gesture.Simultaneous(rotateGesture, pinchGesture);

  // return (
  //   <Canvas gl={{ antialias: false }} shadows>
  //     <ambientLight />
  //     <directionalLight castShadow />
  //     <mesh>
  //       <boxGeometry />
  //       <meshStandardMaterial color="red" />
  //     </mesh>
  //   </Canvas>
  // )

  return (
    <>
      <View style={styles.container}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Canvas
            shadows
            gl={glProps}
            // style={{ flex: 1, backgroundColor: '#000' }}
            style={{ flex: 1 }}
            onCreated={canvasOnCreated}
          >
            {/* <Environment preset='city' /> */}
            <Environment
              files={['white_home_studio_2k.hdr']}
              path='/'

            />
            {/* <Environment files={require('./assets/white_home_studio_2k.hdr')} /> */}
            {/* <Environment files="./assets/white_home_studio_2k.hdr" /> */}
            {/* <directionalLight
              position={[5, 10, 5]}
              intensity={1}
              castShadow
            /> */}

            {/* <ambientLight intensity={0.75} /> */}
            {/* <Light
              name="Area Left"
              position={[-239, 83, 239]}
              rotation={[-1.5, -4.37, -3.14]}
              scale={[10, 10, 10]} // escala é apenas visual
              intensity={556558}
              castShadow />
            <Light
              name="Area Left.001"
              position={[239, 83, -239]}
              rotation={[-1.5, -4.37, -3.14]}
              scale={[10, 10, 10]}
              intensity={556558}
              castShadow />
            <Light
              name="Area Right"
              position={[255, 88, 255]}
              rotation={[-0.43, 1.19, -0.79]}
              scale={[10, 10, 10]}
              intensity={556558}
              castShadow />
            <Light
              name="Area Right.001"
              position={[0, 317, 0]}
              rotation={[-1.71, -0.27, -0.02]}
              scale={[10, 10, 10]}
              intensity={27}
              castShadow /> */}

            {/* <spotLight
              position={[0, 2, 0]}
              intensity={10}
              color={"white"}
              castShadow
            /> */}

            {/* <directionalLight
              position={[0, 2, 0]}
              intensity={1}
              color="white"
              castShadow /> */}

            <Suspense fallback={null}>
              <OrbitCamera orbit={orbit} />
              {
                // !isPlaying && (
                //   <OrbitCamera orbit={orbit} />
                // )
              }
              {/* <Model
                modelPath={modelPath}
                onAnimationNames={onAnimationNamesHandler}
                index={index}
                loop={loop}
                freezeTpose={freezeTpose}
                onBlenderCamera={onBlenderCameraHandler}
                setIsPlaying={setIsPlaying}
                setCurrentFPS={setCurrentFPS}
              /> */}
              {/* <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -1, 0]}
                receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                  color="#eaeaea"
                  roughness={1}
                  metalness={0} />
              </mesh> */}
            </Suspense>

            {/* <Environment preset="warehouse" background environmentIntensity={0.3} /> */}
            {/* <Environment
              files={require('./assets/white_home_studio_2k.hdr')}
              background={false}
            /> */}


            {/* <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} /> */}
          </Canvas>

          <GestureDetector gesture={myGesture}>
            <View
              style={
                StyleSheet.absoluteFillObject
              }
            />
          </GestureDetector>
          {/* {
            !isPlaying == true && (
              <GestureDetector gesture={gesture}>
                <View
                  style={
                    StyleSheet.absoluteFillObject
                  }
                />
              </GestureDetector>
            )
          } */}

        </GestureHandlerRootView>

        <InfoContainer
          animationNames={animationNames}
          blenderCamera={blenderCamera}
          freezeTpose={freezeTpose}
          index={index}
          isPlaying={isPlaying}
          loop={loop}
          showInfo={showInfo}
          currentFPS={currentFPS}
        />

        <ButtonContainer
          index={index}
          isPlaying={isPlaying}
          handleOnNext={handleOnNext}
          handleOnPrevious={handleOnPrevious}
          loop={loop}
          setFreezeTpose={setFreezeTpose}
          setLoop={setLoop}
          animationNames={animationNames}
          toggleInfo={onToggleInfoHandler}
        />
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  infoContainer: {
    position: 'absolute',
    top: 30,
    left: 30,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '30%',
  },
});