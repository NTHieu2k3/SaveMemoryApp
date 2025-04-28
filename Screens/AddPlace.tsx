import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PlaceForm from "../Components/Places/PlaceForm";
import { insertMemory } from "../utill/database";
import { Memory } from "../Models/memory";
import { Alert } from "react-native";

type StackParamList = {
  AllPlaces: undefined;
};

interface AddPlaceProps {
  readonly navigation: NativeStackNavigationProp<StackParamList>;
}

function AddPlace({ navigation }: AddPlaceProps){
  async function createMemoryHandler(memory: Memory): Promise<void> {
    try{
      await insertMemory(memory);
      Alert.alert("Thông báo", "Thêm thành công", [
        {
          text: "OK",
          onPress: () => {
            navigation.replace("AllPlaces");
          },
        },
      ]);
    }
    catch(error: any){
      Alert.alert(`Lỗi: ${error}`)
    }
  }
  return <PlaceForm onCreateMemory={createMemoryHandler} />;
}

export default AddPlace;