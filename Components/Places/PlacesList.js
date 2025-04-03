import { FlatList, StyleSheet, Text, View } from "react-native";
import PlaceItem from "./PlaceItem";
import { Colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

function PlacesList({ memories }) {
  const navigation = useNavigation();

  function selectMemoryHandler(id) {
    navigation.navigate("PlaceDetails", {
      memoryId: id,
    });
  }

  if (!memories || memories.length == 0) {
    return (
      <View style={styles.fallbackContainter}>
        <Text style={styles.fallbackText}>
          No memories added yet - Start adding now !
        </Text>
      </View>
    );
  }
  return (
    <FlatList
      style={styles.list}
      data={memories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PlaceItem memory={item} onSelect={selectMemoryHandler} />
      )}
    />
  );
}

export default PlacesList;

const styles = StyleSheet.create({
  list: {
    margin: 24,
  },
  fallbackContainter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  fallbackText: {
    fontSize: 16,
    color: Colors.primary200,
  },
});
