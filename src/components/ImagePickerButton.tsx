import { Alert, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { File, Paths } from "expo-file-system";

interface ImagePickerButtonProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
}

async function copyImageToAppDirectory(uri: string) {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  const fileName = `${Date.now()}.jpg`;

  const sourceFile = new File(manipulatedImage.uri);
  const destinationFile = new File(Paths.document, fileName);

  await sourceFile.copy(destinationFile);

  return destinationFile.uri;
}

export default function ImagePickerButton({
  imageUri,
  onImageSelected,
}: ImagePickerButtonProps) {
  const handleSelectedImage = async (uri: string) => {
    try {
      const permanentUri = await copyImageToAppDirectory(uri);
      onImageSelected(permanentUri);
    } catch (error) {
      console.log(error);
      Alert.alert("Fehler", "Bild konnte nicht gespeichert werden.");
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Fehler", "Kamera-Zugriff benötigt!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      await handleSelectedImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Fehler", "Galerie-Zugriff benötigt!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      await handleSelectedImage(result.assets[0].uri);
    }
  };

  const handlePress = () => {
    Alert.alert("Bild auswählen", "Wähle eine Option:", [
      {
        text: "Foto aufnehmen",
        onPress: openCamera,
      },
      {
        text: "Aus Galerie wählen",
        onPress: openGallery,
      },
      {
        text: "Abbrechen",
        style: "cancel",
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>Bild hinzufügen</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholderText: {
    color: "gray",
    textAlign: "center",
  },
});