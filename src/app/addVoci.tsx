import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import Voci from "../models/voci";
import VociDetail from "../components/VociDetail";
import { useVoci } from "../context/vociContext";

export default function AddVociScreen() {
  const router = useRouter();
  const { addVoci } = useVoci();

  const handleAdd = (newVoci: Voci) => {
    addVoci(newVoci);
    router.back();
  };

  return (
    <View style={styles.container}>
      <VociDetail onSave={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});