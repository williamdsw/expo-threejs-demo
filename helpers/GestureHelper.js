import { useRef } from "react";
import { Gesture } from "react-native-gesture-handler";

function createGestures(orbit, start, startRadius, isPlaying) {
  const rotateGesture = Gesture.Pan()
    .enabled(!isPlaying)
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
    .enabled(!isPlaying)
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

  return Gesture.Simultaneous(rotateGesture, pinchGesture);
}

export default createGestures;