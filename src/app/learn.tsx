import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useVoci } from "../context/vociContext";

export default function LearnScreen() {
  const router = useRouter();
  const { vociList } = useVoci();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  if (vociList.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Keine Vokabeln vorhanden.</Text>
      </View>
    );
  }

  const currentVoci = vociList[currentIndex];

  const handleNext = () => {
    if (currentIndex < vociList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    } else {
      router.replace("/");
    }
  };

  const handleCorrect = () => {
    setCorrectCount(correctCount + 1);
    handleNext();
  };

  const handleWrong = () => {
    setWrongCount(wrongCount + 1);
    handleNext();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {currentIndex + 1} / {vociList.length}
      </Text>

      <Text style={styles.stats}>
        Richtig: {correctCount} | Falsch: {wrongCount}
      </Text>

      <Text style={styles.title}>Vokabeln lernen</Text>

      <View style={styles.card}>
        {currentVoci.imageUri && (
          <Image
            source={{ uri: currentVoci.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Text style={styles.term}>{currentVoci.term}</Text>

        {showTranslation && (
          <Text style={styles.translation}>
            {currentVoci.translation}
          </Text>
        )}
      </View>

      {!showTranslation && (
        <Pressable
          style={styles.button}
          onPress={() => setShowTranslation(true)}
        >
          <Text style={styles.buttonText}>Übersetzung zeigen</Text>
        </Pressable>
      )}

      {showTranslation && (
        <View style={styles.answerButtons}>
          <Pressable
            style={[styles.answerButton, styles.correctButton]}
            onPress={handleCorrect}
          >
            <Text style={styles.buttonText}>
              {currentIndex === vociList.length - 1
                ? "Zurücksetzen"
                : "Gewusst"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.answerButton, styles.wrongButton]}
            onPress={handleWrong}
          >
            <Text style={styles.buttonText}>Nicht gewusst</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },

  progress: {
    position: "absolute",
    top: 60,
    fontSize: 18,
    fontWeight: "bold",
  },

  stats: {
    position: "absolute",
    top: 90,
    fontSize: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    elevation: 5,
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },

  term: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },

  translation: {
    fontSize: 24,
    marginTop: 20,
    color: "gray",
    textAlign: "center",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  answerButtons: {
    flexDirection: "row",
    marginTop: 30,
    gap: 12,
  },

  answerButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  correctButton: {
    backgroundColor: "green",
  },

  wrongButton: {
    backgroundColor: "red",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});