import { Center, useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Asset } from 'expo-asset';
import { useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three-stdlib';
import { File, Directory, Paths } from 'expo-file-system';

export default function Model({ modelPath, index, onAnimationNames, loop, freezeTpose, onBlenderCamera, setIsPlaying, setCurrentFPS }) {
  const [uri, setUri] = useState(null);
  // const [model, setModel] = useState(null);

  useEffect(() => {
    console.log('useEffect')
    async function load() {
      // console.log('cache:', Paths.cache)
      // console.log('document:', Paths.document)
      // console.log('bundle:', Paths.bundle)
      // console.log('load')
      // const asset = Asset.fromModule(require('../assets/models/CubeLight.glb'));
      // await asset.downloadAsync()
      // const local = asset.localUri ?? asset.uri
      // setUri(local)

      // const path = uri.substring(0, uri.lastIndexOf('/') + 1)
      // const file = uri.substring(uri.lastIndexOf('/') + 1)
      // console.log({ path, file })

      // const loader = new GLTFLoader()
      // loader.setPath(path)

      // console.log('loader', path)

      // loader.load(uri, (gltf) => {
      //   console.log('MODEL:', { gltf })
      // }, (progress) => {
      //   console.log('PROGRESS:', progress.loaded)
      // }, (error) => {
      //   console.log('ERROR:', error)
      // })

      // const gltf = await loader.loadAsync(asset.uri)
      // console.log({ gltf })

      // setModel(gltf);

      // const file = new FileSystem.File(uri)

      // const buffer = await file.arrayBuffer()

      // console.log("buffer length:", buffer.byteLength)

      // const loader = new GLTFLoader()

      // const teste = await loader.parseAsync(buffer);
      // setModel(teste);

      // loader.parse(
      //   buffer,
      //   "",
      //   (gltf) => {
      //     console.log("MODEL LOADED", gltf)
      //   },
      //   (error) => {
      //     console.error("GLTF ERROR", error)
      //   }
      // )
    }

    load();


  }, []);




  // if (!uri) return null;

  // const model = useGLTF(uri);



  // async function logAssetPath() {
  //   const asset = Asset.fromModule(require('../assets/models/SapoTake0012.glb'));
  //   await asset.downloadAsync();
  //   console.log(asset.localUri || asset.uri);
  // }

  // logAssetPath();

  // const { scene, animations, cameras } = useGLTF(require('../assets/models/SapoTake0012.glb'));
  // const { scene, animations, cameras } = useGLTF(require('../assets/models/testeHDRI.glb'));
  // const { scene, animations, cameras } = useGLTF(require('../assets/models/TesteMaterialNovo.glb'));
  // const { scene, animations, cameras } = useGLTF(require('../assets/models/SapoTake001 3.glb'));
  // const { scene, animations, cameras } = useGLTF('file:///data/user/0/host.exp.exponent/files/SapoTake001.glb');
  const { scene, animations, cameras } = useGLTF(modelPath);
  // console.log('uri: 2', { uri })
  // if (!uri) return null;

  // const { scene, animations, cameras } = model;
  const { actions, names, mixer } = useAnimations(animations, scene);
  const { set, size } = useThree();

  const frames = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    frames.current++
    const now = performance.now()

    if (now - lastTime.current >= 1000) {
      setCurrentFPS(frames.current)
      frames.current = 0
      lastTime.current = now
    }
  })

  useEffect(() => {
    // console.log('useEffect 1', { cameras })
    if (cameras && cameras.length > 0) {
      const gblCamera = cameras[0];
      gblCamera.aspect = size.width / size.height;
      gblCamera.updateProjectionMatrix();
      console.log('near', gblCamera.near, 'far', gblCamera.far, 'fov', gblCamera.fov, 'zoom', gblCamera.zoom, 'type', gblCamera.type);
      // gblCamera.near = 0.1;
      // gblCamera.far = 100;
      // gblCamera.fov = 75;
      // gblCamera.zoom = 1

      set({ camera: gblCamera });
      onBlenderCamera(gblCamera);
    }
  }, [cameras, size, set]);

  useEffect(() => {
    console.log('useEffect 2')
    scene.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true;
        // obj.receiveShadow = true;
      }

      if (obj.isLight) {
        console.log({
          name: obj.name,
          position: obj.position,
          rotation: obj.rotation,
          scale: obj.scale,
          intensity: obj.intensity,
        })
        // position={[5, 10, 5]}
        // obj.intensity *= 10;
        // obj.intensity = 10;
        // obj.castShadow = true;
        // console.log(obj.position)
        // obj.position = {
        //   x: 5,
        //   y: 10,
        //   z: 5
        // }
        // const helper = new THREE.PointLightHelper(obj);
        // scene.add(helper)
      }
    })

    // arquivos HDR não funcionam no expo

    // async function loadHDR() {
    //   console.log('{ loadHDR }')
    //   const asset = Asset.fromModule(require('./assets/white_home_studio_2k.hdr'));
    //   await asset.downloadAsync();
    //   const loader = new HDRLoader();
    //   loader.load(asset.localUri || asset.uri, (texture) => {
    //     texture.mapping = THREE.EquirectangularReflectionMapping;
    //     scene.enviroment = texture;
    //   });
    // }

    // loadHDR();
  }, [scene])

  useEffect(() => {
    print(names)
    // names.sort()
    names.sort((a, b) => {
      // Extract the leading number from string 'a'
      const numA = parseInt(a.match(/^\d+/)[0], 10);
      // Extract the leading number from string 'b'
      const numB = parseInt(b.match(/^\d+/)[0], 10);

      // Sort numerically by the extracted number
      return numA - numB;
    });
    onAnimationNames(names);
  }, []);

  useEffect(() => {
    console.log('useEffect 3')

    Object.values(actions).forEach(action => {
      action.stop();
    })

    if (!names[index]) return;

    setIsPlaying(true);

    const current = actions[names[index]];
    if (current) {
      // console.log("First keyframe time:", clip.tracks[0].times[0])

      // Ajusta questão as animações não iniciarem no segundo 1
      // const clip = current.getClip();
      // clip.tracks.forEach(track => {
      //   const offset = track.times[0]
      //   for (let i = 0; i < track.times.length; i++) {
      //     track.times[i] -= offset
      //   }
      // })

      // clip.duration -= clip.tracks[0].times[0]
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
    console.log('useEffect 4')

    if (freezeTpose) {
      Object.values(actions).forEach(action => {
        action.stop();
      })
    }

  }, [freezeTpose]);


  return (
    // <Center>
    <primitive object={scene} scale={0.01} />
    // </Center>
  )
}