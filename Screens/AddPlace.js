import PlaceForm from "../Components/Places/PlaceForm";
import { insertMemory } from "../utill/database";

function AddPlace({ navigation }) {
  async function createMemoryHandler(memory) {
    await insertMemory(memory);

    navigation.replace("AllPlaces");
  }
  return <PlaceForm onCreateMemory={createMemoryHandler} />;
}

export default AddPlace;
