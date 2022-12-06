import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';
import base64 from 'base64-js';
import {Platform} from 'react-native';

function stringToUint8Array(str) {
  const length = str.length;
  const array = new Uint8Array(new ArrayBuffer(length));
  for (let i = 0; i < length; i++) array[i] = str.charCodeAt(i);
  return array;
}

export async function fileToBase64(uri) {
  try {
    const content = await FileSystem.readAsStringAsync(uri);
    return base64.fromByteArray(stringToUint8Array(content));
  } catch (e) {
    console.warn('fileToBase64()', e.message);
    return '';
  }
}

export function uriCleaner(uri) {
  return Platform.OS === 'ios' ? unescape(uri) : uri;
}

export async function convertFileUriToUploadInfo(uri) {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (fileInfo.exists) {
    const mediaType = mime.lookup(uri);
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const content = `data:${mediaType};base64,${base64}`;

    return content;
  }

  return null;
}
