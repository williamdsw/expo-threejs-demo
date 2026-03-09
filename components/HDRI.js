import { useThree } from "@react-three/fiber";
import { Asset } from "expo-asset";
import { useEffect } from "react";
import { RGBELoader } from 'three-stdlib';


export default function HDRI({ setEnvironmentIntensity }) {
  console.log('HDRI')
  const { scene } = useThree();

  useEffect(() => {
    async function loadHDR() {
      console.log('loadHDR')
      // const asset = Asset.fromModule(require("../assets/hdri/white_home_studio_2k.hdr"));
      const asset = Asset.fromModule(require("../assets/hdri/german_town_street_1k.hdr"));
      await asset.downloadAsync();
      const loader = new RGBELoader();

      loader.load(asset.localUri || asset.uri, (texture) => {
        console.log('loader')
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        console.log('environmentIntensity:', scene.environmentIntensity)
        scene.environmentIntensity = 1;
        scene.background = texture;
        setEnvironmentIntensity(scene.environmentIntensity)
      });
    }

    loadHDR();

  }, []);

  return null;
}