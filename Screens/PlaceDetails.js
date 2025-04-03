import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import OutlineButton from "../Components/UI/OutlineButton";
import { Colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { deleteMemory, fetchMemoryDetail } from "../utill/database";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../Components/UI/IconButton";

function PlaceDetails({ route, navigation }) {
  const [fetchedMemory, setFetchedMemory] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedMemoryId = route.params.memoryId;

  useEffect(() => {
    async function loadMemoryData() {
      const memory = await fetchMemoryDetail(selectedMemoryId);
      setFetchedMemory(memory);
      navigation.setOptions({
        title: memory.title,
      });
    }

    loadMemoryData();
  }, [selectedMemoryId]);

  function showOnMapHandler() {
    setModalVisible(true);
  }

  function closeModalHandler() {
    setModalVisible(false);
  }

  async function deleteHandler() {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa memory này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await deleteMemory(fetchedMemory.id);
            Alert.alert("Xóa thành công");
            navigation.goBack();
          } catch (error) {
            console.log("Lỗi khi xóa memory:", error);
            Alert.alert("Lỗi", "Không thể xóa memory. Vui lòng thử lại.");
          }
        },
      },
    ]);
  }

  if (!fetchedMemory) {
    return (
      <View style={styles.fallback}>
        <Text>Loading memory data...</Text>
      </View>
    );
  }
  const region = {
    latitude: fetchedMemory.location.latitude,
    longitude: fetchedMemory.location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: fetchedMemory.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedMemory.address}</Text>
        </View>
      </View>

      <MapView
        style={styles.mapPreview}
        region={region}
        loadingEnabled={true}
        mapType="hybrid"
      >
        <Marker
          coordinate={fetchedMemory.location}
          title="Selected Memory Location"
        />
      </MapView>

      <OutlineButton icon="map" onPress={showOnMapHandler}>
        View on Map
      </OutlineButton>

      <IconButton icon="trash" size={30} color="red" onPress={deleteHandler} />

      <Modal visible={modalVisible} animationType="slide">
        <MapView
          style={styles.fullScreenMap}
          region={region}
          loadingEnabled={true}
          mapType="hybrid"
        >
          <Marker
            coordinate={fetchedMemory.location}
            title="Selected Memory Location"
          />
        </MapView>
        <View style={styles.closeButtonContainer}>
          <OutlineButton icon="close" onPress={closeModalHandler}>
            Close Map
          </OutlineButton>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },

  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  addressContainer: {
    padding: 20,
  },

  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  fullScreenMap: {
    flex: 1,
  },

  closeButtonContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
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
});
