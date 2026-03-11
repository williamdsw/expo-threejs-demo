import { Center, ContactShadows, Environment, useAnimations, useGLTF, useHelper } from '@react-three/drei/native';
import Checkbox from 'expo-checkbox';
import { THREE } from 'expo-three';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { DirectionalLightHelper, PointLightHelper } from 'three';
import Light from '../components/Light';
import Model from '../components/Model';
import InfoContainer from '../components/InfoContainer';
import ButtonContainer from '../components/ButtonContainer';
import { canvasOnCreated, glProps } from '../helpers/CanvasHelper';
import OrbitCamera from '../components/OrbitCamera';
import createGestures from '../helpers/GestureHelper';
import HDRI from '../components/HDRI';
import { copyFile, doesFileExists } from '../helpers/FileHelper';
import { File, Directory, Paths } from 'expo-file-system';


const cameraProps = { position: [0, 0, 5], fov: 50 }

export default function DownloadScreen({ setModelPath, setShowModel }) {
  const [filePath, setFilePath] = useState(Paths.join(Paths.document, "SapoTake001.glb"));
  const [fileExists, setFileExists] = useState(false);

  useEffect(() => {
    checkFile()
  }, []);

  function checkFile() {
    const exists = doesFileExists(filePath)
    setFileExists(exists)
    if (exists) {
      setModelPath(filePath)
    }
  }

  function Copy() {
    if (fileExists) return;

    copyFile(filePath);
    checkFile()
  }

  return (
    <>
      <View style={styles.container}>
        <Text>Caminho do arquivo GBL: {filePath}</Text>
        <Text>Arquivo Existe: {fileExists ? 'Sim' : 'Nao'}</Text>
        {!fileExists && <Button title='Copiar Arquivo' onPress={Copy} />}
        {fileExists && <Button title='Carregar GLTF' onPress={() => setShowModel(true)} />}
      </View >
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});