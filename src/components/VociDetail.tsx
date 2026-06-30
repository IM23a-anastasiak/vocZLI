import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

import Voci from "../models/voci";
import ImagePickerButton from "./ImagePickerButton";

interface VociDetailProps {
  onSave: (voci: Voci) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  initialVoci?: Voci;
}

export default function VociDetail({
  onSave,
  onCancel,
  onDelete,
  initialVoci,
}: VociDetailProps) {
  const [term, setTerm] = useState(initialVoci?.term ?? "");
  const [translation, setTranslation] = useState(
    initialVoci?.translation ?? ""
  );
  const [imageUri, setImageUri] = useState(initialVoci?.imageUri);

  const isEditMode = initialVoci !== undefined;

  const handleSave = () => {
    if (term.trim() === "" || translation.trim() === "") {
      Alert.alert("Fehler", "Bitte fülle beide Felder aus.");
      return;
    }

    const savedVoci: Voci = {
      term: term.trim(),
      translation: translation.trim(),
      imageUri: imageUri,
    };

    onSave(savedVoci);

    if (!isEditMode) {
      setTerm("");
      setTranslation("");
      setImageUri(undefined);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Vokabel löschen",
      "Möchtest du diese Vokabel wirklich löschen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ImagePickerButton
        imageUri={imageUri}
        onImageSelected={setImageUri}
      />

      <TextInput
        style={styles.input}
        placeholder="Englisches Wort (z.B. Apple)"
        placeholderTextColor="gray"
        value={term}
        onChangeText={setTerm}
      />

      <TextInput
        style={styles.input}
        placeholder="Deutsche Übersetzung (z.B. Apfel)"
        placeholderTextColor="gray"
        value={translation}
        onChangeText={setTranslation}
      />

      <View style={styles.button}>
        <Button title="Speichern" onPress={handleSave} />
      </View>

      {isEditMode && (
        <>
          <View style={styles.button}>
            <Button title="Abbrechen" onPress={onCancel} />
          </View>

          <View style={styles.button}>
            <Button title="Löschen" color="red" onPress={handleDelete} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },

  button: {
    width: "100%",
    marginBottom: 10,
  },
});