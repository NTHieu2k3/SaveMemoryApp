import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, Linking, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import OutlineButton from "../UI/OutlineButton";

interface ImagePickerProps {
  readonly onTakenImage: (imageUri: string) => void;
}

function ImagePicker({ onTakenImage }: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState<string>();

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions(): Promise<boolean> {
    try {
      if (!cameraPermissionInformation) {
        return false;
      }

      if (
        cameraPermissionInformation.status === PermissionStatus.UNDETERMINED
      ) {
        const permissionResponse = await requestPermission();
        return permissionResponse.granted;
      }

      if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
        const permissionResponse = await requestPermission();
        if (!permissionResponse.granted) {
          Alert.alert(
            "Insufficient Permission !",
            "You need to grant camera permissions to use this app.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      Alert.alert(`Lỗi: ${error}`);
      return false;
    }
  }

  async function takeImageHandler(): Promise<void> {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (image.canceled || !image.assets || image.assets.length == 0) {
      Alert.alert("No image capture");
      return;
    }

    setPickedImage(image.assets[0].uri);
    onTakenImage(image.assets[0].uri);
  }

  let imagePriview = <Text>No image taken yet</Text>;

  if (pickedImage) {
    imagePriview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>{imagePriview}</View>
      <OutlineButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlineButton>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },

  image: {
    width: "100%",
    height: "100%",
  },
});
