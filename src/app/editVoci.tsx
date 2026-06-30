import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Voci from "../models/voci";
import VociDetail from "../components/VociDetail";
import { useVoci } from "../context/vociContext";

export default function EditVociScreen() {
  const router = useRouter();
  const { term } = useLocalSearchParams();
  const { vociList, updateVoci, removeVoci } = useVoci();

  const termString = Array.isArray(term) ? term[0] : term;

  const selectedVoci = vociList.find((voci) => voci.term === termString);

  if (!selectedVoci) {
    return (
      <View style={styles.container}>
        <Text>Vokabel nicht gefunden.</Text>
      </View>
    );
  }

  const handleSave = (updatedVoci: Voci) => {
    updateVoci(selectedVoci.term, updatedVoci);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleDelete = () => {
    removeVoci(selectedVoci.term);
    router.back();
  };

  return (
    <View style={styles.container}>
      <VociDetail
        initialVoci={selectedVoci}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});