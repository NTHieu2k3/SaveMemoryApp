import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import PlacesList from "../Components/Places/PlacesList";
import { fetchMemories } from "../utill/database";
import { Memory } from "../Models/memory";

function AllPlaces() {
  const [loadedMemories, setLoadedMemories] = useState<Memory[]>([]);
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