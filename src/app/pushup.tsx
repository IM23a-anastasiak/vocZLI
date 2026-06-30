import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function PushupScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [zValue, setZValue] = useState(0);
  const [phase, setPhase] = useState<"oben" | "unten">("oben");

  const lastCountTime = useRef(0);

  const upperThreshold = -0.8;
  const lowerThreshold = -1.1;
  const cooldown = 450;

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    if (isRunning) {
      Accelerometer.setUpdateInterval(100);

      subscription = Accelerometer.addListener(({ z }) => {
        setZValue(z);

        const now = Date.now();

        if (phase === "oben" && z < lowerThreshold) {
          setPhase("unten");
        }

        if (
          phase === "unten" &&
          z > upperThreshold &&
          now - lastCountTime.current > cooldown
        ) {
          setCount((oldCount) => oldCount + 1);
          setPhase("oben");
          lastCountTime.current = now;
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isRunning, phase]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setCount(0);
    setPhase("oben");
    lastCountTime.current = 0;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liegestützenzähler</Text>

      <Text style={styles.counter}>{count}</Text>

      <Text style={styles.info}>Live z: {zValue.toFixed(3)}</Text>
      <Text style={styles.info}>Phase: {phase}</Text>

      <Pressable style={styles.button} onPress={handleStartStop}>
        <Text style={styles.buttonText}>
          {isRunning ? "Stop" : "Start"}
        </Text>
      </Pressable>

      <Pressable style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.buttonText}>Zurücksetzen</Text>
      </Pressable>
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

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  counter: {
    fontSize: 80,
    fontWeight: "bold",
    marginBottom: 20,
  },

  info: {
    fontSize: 18,
    marginBottom: 8,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },

  resetButton: {
    marginTop: 12,
    backgroundColor: "gray",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});