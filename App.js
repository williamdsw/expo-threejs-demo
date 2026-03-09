import { View } from "react-native";
import ModelScreen from "./screens/ModelScreen";
import { Text } from "react-native";
import { Button } from "react-native";

export default function App() {
  return <>
    {/* <ModelScreen /> */}
    <View>
      <Button title="Botão" onPress={() => console.log('aqui')} />
      <Text>Testando!</Text>
    </View>
  </>
}