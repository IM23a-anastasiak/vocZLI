import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Voci from "../models/voci";

type Props = {
  voci: Voci;
};

export default function VociItem({ voci }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push(`/editVoci?term=${encodeURIComponent(voci.term)}`)
      }
    >
      {/* Bild oder Placeholder */}
      {voci.imageUri ? (
        <Image source={{ uri: voci.imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Kein Bild</Text>
        </View>
      )}

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.term}>{voci.term}</Text>
        <Text style={styles.translation}>{voci.translation}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    elevation: 4,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },

  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  placeholderText: {
    fontSize: 10,
    color: "gray",
    textAlign: "center",
  },

  textContainer: {
    flex: 1,
  },

  term: {
    fontSize: 18,
    fontWeight: "bold",
  },

  translation: {
    fontSize: 16,
    color: "gray",
  },
});