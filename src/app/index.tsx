import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import VociItem from "../components/VociItem";
import { useVoci } from "../context/vociContext";

export default function Index() {
  const router = useRouter();
  const { vociList, isLoading } = useVoci();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => router.push("/addVoci")}>
              <Ionicons name="add" size={28} color="#fff" />
            </Pressable>
          ),
        }}
      />

      <View style={styles.header}>
        <Text>VocZLI</Text>
        <Text>Meine Vokabel-Lern-App</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={vociList}
          renderItem={({ item }) => <VociItem voci={item} />}
          keyExtractor={(item) => item.term}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={50} color="gray" />
              <Text style={styles.emptyText}>Keine Vokabeln vorhanden.</Text>
            </View>
          }
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push("/learn")}
      >
        <Ionicons name="play" size={28} color="#fff" />
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.fabsettings, pressed && styles.fabPressedsettings]}
        onPress={() => router.push("/SensorDebug")}
      >
        <Ionicons name="menu" size={28} color="#fff" />
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.fabpushup, pressed && styles.fabpushup]}
        onPress={() => router.push("/pushup")}
      >
        <Ionicons name="barbell" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  list: {
    paddingHorizontal: 16,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyText: {
    marginTop: 10,
    color: "gray",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  fabPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  fabsettings: {
    position: "absolute",
    left: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  fabPressedsettings: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  fabpushup: {
    position: "absolute",
    left: 20,
    top: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  fabPressedpushup: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});