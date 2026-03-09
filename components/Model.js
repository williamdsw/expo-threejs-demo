import { Center, useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export default function Model({ modelPath, index, onAnimationNames, loop, freezeTpose, onBlenderCamera, setIsPlaying, setCurrentFPS }) {
  console.log({ modelPath })
  // const { scene, animations, cameras } = useGLTF(require('../assets/models/SapoTake0012.glb'));
  const { scene, animations, cameras } = useGLTF(require('../assets/models/testeHDRI.glb'));
  const { actions, names, mixer } = useAnimations(animations, scene);
  const { set, size } = useThree();

  let frames = 0
  let lastTime = performance.now()

  useFrame(() => {
    frames++
    const now = performance.now()

    if (now - lastTime >= 1000) {
      setCurrentFPS(frames)
      frames = 0
      lastTime = now
    }
  })

  useEffect(() => {
    console.log('useEffect 1')
    if (cameras && cameras.length > 0) {
      const gblCamera = cameras[0];
      gblCamera.aspect = size.width / size.height;
      gblCamera.updateProjectionMatrix();
      console.log('near', gblCamera.near, 'far', gblCamera.far, 'fov', gblCamera.fov, 'zoom', gblCamera.zoom, 'type', gblCamera.type);
      // gblCamera.near = 0.1;
      // gblCamera.far = 100;
      // gblCamera.fov = 75;
      // gblCamera.zoom = 1

      // set({ camera: gblCamera });
      // onBlenderCamera(gblCamera);
    }
  }, [cameras, size, set]);

  useEffect(() => {
    console.log('useEffect 2')
    scene.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
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
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  )
}