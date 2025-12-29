import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

export const ImageToBase64 = async (image: any) => {
  const asset = Asset.fromModule(image);
  await asset.downloadAsync();

  return await FileSystem.readAsStringAsync(asset.localUri!, {
    encoding: 'base64',
  });
};

