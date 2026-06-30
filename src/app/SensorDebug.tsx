import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { Accelerometer } from "expo-sensors";

type SensorData = {
  x: number;
  y: number;
  z: number;
};

const WINDOW_SIZE = 5;
const HISTORY_SIZE = 20;

export default function SensorDebug() {
  const [data, setData] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const [history, setHistory] = useState<SensorData[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  const getAverage = (values: SensorData[]) => {
    const sum = values.reduce(
      (acc, item) => ({
        x: acc.x + item.x,
        y: acc.y + item.y,
        z: acc.z + item.z,
      }),
      { x: 0, y: 0, z: 0 }
    );

    return {
      x: sum.x / values.length,
      y: sum.y / values.length,
      z: sum.z / values.length,
    };
  };

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    if (isRunning) {
      Accelerometer.setUpdateInterval(100);

      subscription = Accelerometer.addListener((newData) => {
        setHistory((oldHistory) => {
          const updatedHistory = [newData, ...oldHistory].slice(
            0,
            HISTORY_SIZE
          );

          const smoothingWindow = updatedHistory.slice(0, WINDOW_SIZE);
          const smoothedData = getAverage(smoothingWindow);

          setData(smoothedData);

          return updatedHistory;
        });
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isRunning]);

  const renderBar = (value: number) => {
    const width = Math.min(Math.abs(value) * 100, 100);

    return (
      <View style={styles.barWrapper}>
        <View style={styles.centerLine} />

        {value < 0 ? (
          <View style={[styles.barNegative, { width: `${width}%` }]} />
        ) : (
          <View style={[styles.barPositive, { width: `${width}%` }]} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Debug</Text>

      <View style={styles.card}>
        <Text style={styles.value}>x: {data.x.toFixed(3)}</Text>
        {renderBar(data.x)}

        <Text style={styles.value}>y: {data.y.toFixed(3)}</Text>
        {renderBar(data.y)}

        <Text style={styles.value}>z: {data.z.toFixed(3)}</Text>
        {renderBar(data.z)}
      </View>

      <Pressable
        style={styles.button}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={styles.buttonText}>{isRunning ? "Pause" : "Resume"}</Text>
      </Pressable>

      <Text style={styles.historyTitle}>Letzte 20 Messwerte</Text>

      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        style={styles.historyList}
        renderItem={({ item }) => (
          <Text style={styles.historyItem}>
            x: {item.x.toFixed(2)} | y: {item.y.toFixed(2)} | z:{" "}
            {item.z.toFixed(2)}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },

  value: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 6,
  },

  barWrapper: {
    height: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },

  centerLine: {
    position: "absolute",
    left: "50%",
    width: 2,
    height: "100%",
    backgroundColor: "#555",
  },

  barPositive: {
    position: "absolute",
    left: "50%",
    height: "100%",
    backgroundColor: "green",
  },

  barNegative: {
    position: "absolute",
    right: "50%",
    height: "100%",
    backgroundColor: "red",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },

  historyList: {
    flex: 1,
  },

  historyItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});