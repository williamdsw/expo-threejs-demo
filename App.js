import { View } from "react-native";
import ModelScreen from "./screens/ModelScreen";
import { Text } from "react-native";
import { Button } from "react-native";
import DownloadScreen from "./screens/DownloadScreen";
import { useState } from "react";

export default function App() {
  const [modelPath, setModelPath] = useState(null);
  const [showModel, setShowModel] = useState(false);

  return <>
    {!showModel && <DownloadScreen setModelPath={setModelPath} setShowModel={setShowModel} />}
    {showModel && <ModelScreen modelPath={modelPath} />}
  </>
}