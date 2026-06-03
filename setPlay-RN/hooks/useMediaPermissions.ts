import { Audio } from "expo-av";
import { Camera } from "expo-camera";

export const requestMediaPermissions = async () => {
  const cameraPermission = await Camera.requestCameraPermissionsAsync();
  const audioPermission = await Audio.requestPermissionsAsync();

  return (
    cameraPermission.status === "granted" &&
    audioPermission.status === "granted"
  );
};
