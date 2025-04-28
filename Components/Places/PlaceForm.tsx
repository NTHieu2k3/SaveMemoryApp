import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";

import { Memory } from "../../Models/memory";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../UI/Button";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface OnCreateMemoryProps {
  readonly onCreateMemory: (memoryData: Memory) => void;
}

function PlaceForm({ onCreateMemory }: OnCreateMemoryProps) {
  const [enteredTitle, setEnteredTitle] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [pickedLocation, setPickedLocation] = useState<Location>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function changeTitleHandler(enteredText: string): void {
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri: string): void {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback(
    (location: { lat: number; lng: number }, address: string) => {
      setPickedLocation({
        lat: location.lat,
        lng: location.lng,
        address: address,
      });
    },
    []
  );

  function savePlaceHandler(): void {
    if (!enteredTitle.trim() || !selectedImage || !pickedLocation) {
      console.log("Please complete all fields!");
      return;
    }

    setIsLoading(true);

    const id = Math.random().toString();

    const memoryData = new Memory(
      enteredTitle,
      selectedImage,
      {
        latitude: pickedLocation.lat,
        longitude: pickedLocation.lng,
        address: pickedLocation.address,
      },
      id
    );

    onCreateMemory(memoryData);

    setIsLoading(false);
    console.log("Data: ", memoryData);
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onTakenImage={takeImageHandler} />
      <LocationPicker onPickLocation={pickLocationHandler} />
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary500} />
      ) : (
        <Button onPress={savePlaceHandler}>Add Memory</Button>
      )}
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },

  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
