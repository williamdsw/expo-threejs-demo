import { Asset } from 'expo-asset';
import { File, Directory, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

function doesFileExists(path) {
  try {
    console.log('doesFileExists', { path });
    if (Platform.OS === 'web') {
      return false;
    }

    const file = new File(path);
    return file.exists;
  } catch (error) {
    return false;
  }
}

async function loadAsset() {
  try {
    const asset = Asset.fromModule(require('../assets/models/SapoTake001 3.glb'));

    console.log('OS:', Platform.OS);
    console.log('asset:', { asset });

    if (Platform.OS === 'web') {
      return asset.uri;
    }

    await asset.downloadAsync();

    return asset.localUri ?? asset.uri
  } catch (error) {
    console.error(error)
    return null;
  }
}

async function copyFile(destination) {
  try {
    const uri = await loadAsset();
    const src = new File(uri);
    const copied = new File(destination);
    src.copy(copied);
  } catch (error) {
    console.error(error)
  }
}

export { doesFileExists, copyFile }
