import { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import PlacesList from "../Components/Places/PlacesList";
import { fetchMemories } from "../utill/database";

function AllPlaces({ route }) {
  const [loadedMemories, setLoadedMemories] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadMemories() {
      const memories = await fetchMemories();
      setLoadedMemories(memories);
    }

    if (isFocused) {
      loadMemories();
    }
  }, [isFocused]);

  return <PlacesList memories={loadedMemories} />;
}

export default AllPlaces;
