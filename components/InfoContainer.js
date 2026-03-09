import { StyleSheet, Text, View } from "react-native";

export default function InfoContainer({
  animationNames,
  index,
  isPlaying,
  loop,
  freezeTpose,
  blenderCamera,
  showInfo,
  currentFPS,
  environmentIntensity,
}) {
  let content;
  if (showInfo) {
    content = (
      <View style={styles.infoContainer}>
        {/* <Text>
          Animações/Ações:
          {animationNames.length > 0 ? animationNames.join(', ') : 'Nenhuma animação encontrada'}
        </Text>
        <Text>
          Animação/Ação atual: {index >= 0 ? animationNames[index] : 'T-pose'}
        </Text>
        <Text>
          Animação atual: {index >= 0 ? animationNames[index] : 'T-pose'}
        </Text>
        <Text>
          Index atual: {index}
        </Text>
        <Text>
          Está tocando animação: {isPlaying ? 'Sim' : 'Não'}
        </Text>
        <Text>
          Animação/Ação em Loop: {loop ? 'Sim' : 'Não'}
        </Text>
        <Text>
          T-Pose? {freezeTpose ? 'Sim' : 'Não'}
        </Text>
        <Text>
          Modelagem tem camera? {blenderCamera ? 'Sim' : 'Não'}
        </Text> */}
        <Text>FPS: {currentFPS}</Text>
        <Text>Intensidade do ambiente/HDRI: {environmentIntensity}</Text>
      </View>
    );
  }

  return <>{content}</>;
}

const styles = StyleSheet.create({
  infoContainer: {
    position: "absolute",
    top: 30,
    left: 30,
    backgroundColor: "lightgray",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
  },
});
