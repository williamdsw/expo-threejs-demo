import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLightHelper, PointLightHelper } from "three";

export default function Light({ position, rotation, scale, intensity }) {
  console.log('{ Light }')
  const lightRef = useRef(null);
  useHelper(lightRef, DirectionalLightHelper, 1, 'white')
  return (
    <directionalLight
      ref={lightRef}
      position={position}
      rotation={rotation}
      scale={scale}
      intensity={intensity}
      castShadow
    />
  )
}