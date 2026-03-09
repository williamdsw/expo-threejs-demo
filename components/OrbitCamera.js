import { useFrame, useThree } from "@react-three/fiber";

export default function OrbitCamera({ orbit }) {
  console.log('OrbitCamera')
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