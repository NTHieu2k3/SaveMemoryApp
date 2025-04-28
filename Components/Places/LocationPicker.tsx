import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";
import {
  getCurrentPositionAsync,
  PermissionStatus,
  useForegroundPermissions,
} from "expo-location";
import MapView, { Marker, Region, MapPressEvent } from "react-native-maps";
import OutlineButton from "../UI/OutlineButton";
import { useState, useEffect } from "react";
import { getAddress } from "../../utill/location";

interface Location {
  lat: number;
  lng: number;
}

interface OnPickLocationProps {
  readonly onPickLocation: (Location: Location, address: string) => void;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

function LocationPicker({ onPickLocation }: OnPickLocationProps) {
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  const [pickedLocation, setPickedLocation] = useState<Coordinate | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [locationSource, setLocationSource] = useState<"GPS" | "MAP" | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (pickedLocation) {
      setRegion({
        latitude: pickedLocation.latitude,
        longitude: pickedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [pickedLocation]);

  useEffect(() => {
    async function handlerLocation() {
      if (pickedLocation) {
        setIsLoading(true);
        const address = await getAddress(
          pickedLocation.latitude,
          pickedLocation.longitude
        );
        setIsLoading(false);
        onPickLocation({ lat: pickedLocation.latitude, lng: pickedLocation.longitude }, address);
      }
    }
    handlerLocation();
  }, [pickedLocation, onPickLocation]);

  async function verifyPermissions() :Promise<boolean> {
    if (!locationPermissionInformation) return false;

    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      const permissionResponse = await requestPermission();
      if (!permissionResponse.granted) {
        Alert.alert(
          "Insufficient Permission !",
          "You need to grant location permissions to use this app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => {Linking.openSettings()} },
          ]
        );
        return false;
      }
    }

    return true;
  }

  async function getLocationHandler(): Promise<void> {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    const location = await getCurrentPositionAsync();
    const { latitude, longitude } = location.coords;

    setPickedLocation({ latitude, longitude });
    setSelectedLocation(null);
    setLocationSource("GPS");
  }

  async function pickOnMapHandler(): Promise<void> {
    let defaultLocation = pickedLocation;

    if (!defaultLocation) {
      const hasPermission = await verifyPermissions();
      if (!hasPermission) {
        return;
      }

      const location = await getCurrentPositionAsync();
      defaultLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    }

    setSelectedLocation(defaultLocation);
    setModalVisible(true);
  }

  function handleMapPress(event: MapPressEvent): void {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  }

  function confirmLocationHandler(): void {
    setPickedLocation(selectedLocation);
    setModalVisible(false);
    setLocationSource("MAP");
  }

  let content;
  if (isLoading) {
    content = <ActivityIndicator size="large" color={Colors.primary500} />;
  } else if (region) {
    content = (
      <MapView
        style={styles.mapPreview}
        region={region}
        loadingEnabled={true}
        mapType="hybrid"
      >
        {pickedLocation && (
          <Marker
            coordinate={pickedLocation}
            title={
              locationSource === "GPS" ? "Your Location" : "Selected Location"
            }
          />
        )}
      </MapView>
    );
  } else {
    content = (
      <View style={styles.mapPreview}>
        <Text>No location picked yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {content}
      <View style={styles.actions}>
        <OutlineButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlineButton>
        <OutlineButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlineButton>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <MapView
          style={styles.fullScreenMap}
          onPress={handleMapPress}
          loadingEnabled={true}
          mapType="hybrid"
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} title="Selected Location" />
          )}
        </MapView>
        <View style={styles.confirmButtonContainer}>
          <OutlineButton icon="checkmark" onPress={confirmLocationHandler}>
            Confirm Location
          </OutlineButton>
        </View>
      </Modal>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },

  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },

  infoText: {
    textAlign: "center",
    marginVertical: 5,
    fontSize: 14,
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  fullScreenMap: {
    flex: 1,
  },

  confirmButtonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
});
