import Checkbox from "expo-checkbox";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ButtonContainer({ toggleInfo, setFreezeTpose, isPlaying, index, handleOnPrevious, handleOnNext, loop, setLoop, animationNames }) {
  return (
    <>
      <View style={styles.buttonContainer}>
        {/* <Button
          title='Congelar T-pose'
          onPress={() => setFreezeTpose(true)}
          disabled /> */}
        <Button title="Toggle Info" onPress={toggleInfo} />
        <Button
          title='Animação Anterior'
          disabled={isPlaying || index <= 0}
          onPress={handleOnPrevious}
        />
        <Button
          title='Próxima Animação'
          disabled={isPlaying || index == animationNames.length - 1}
          onPress={handleOnNext}
        />
        {/* <Checkbox value={loop} onValueChange={setLoop} color={loop ? '#4630EB' : undefined} />
        <Text>Loop</Text> */}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%',
  },
});