import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { PointLightHelper } from "three";

export default function Light({ position, rotation, scale, intensity }) {
  const lightRef = useRef(null);
  useHelper(lightRef, PointLightHelper, 1, 'white')
  return (
    <pointLight
      ref={lightRef}
      position={position}
      rotation={rotation}
      scale={scale}
      intensity={intensity}
      castShadow
    />
  )
}