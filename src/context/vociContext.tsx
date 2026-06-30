import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import Voci from "../models/voci";

interface VociContextType {
  vociList: Voci[];
  isLoading: boolean;
  addVoci: (voci: Voci) => void;
  updateVoci: (term: string, updatedVoci: Voci) => void;
  removeVoci: (term: string) => void;
}

const VociContext = createContext<VociContextType | undefined>(undefined);

async function deleteImage(uri?: string) {
  if (!uri) return;

  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    console.log("Bild gelöscht");
  } catch (error) {
    console.log("Fehler beim Löschen des Bildes:", error);
  }
}

export function VociProvider({ children }: { children: ReactNode }) {
  const [vociList, setVociList] = useState<Voci[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVocis = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("vocis");

        if (jsonValue !== null) {
          const loadedVocis: Voci[] = JSON.parse(jsonValue);
          setVociList(loadedVocis);
          console.log("Vocis geladen");
        }
      } catch (error) {
        console.log("Fehler beim Laden der Vocis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVocis();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const saveVocis = async () => {
      try {
        await AsyncStorage.setItem("vocis", JSON.stringify(vociList));
        console.log("Vocis gespeichert");
      } catch (error) {
        console.log("Fehler beim Speichern der Vocis:", error);
      }
    };

    saveVocis();
  }, [vociList, isLoading]);

  const addVoci = (voci: Voci) => {
    setVociList([...vociList, voci]);
  };

  const updateVoci = (term: string, updatedVoci: Voci) => {
    const oldVoci = vociList.find((voci) => voci.term === term);

    if (
      oldVoci?.imageUri &&
      oldVoci.imageUri !== updatedVoci.imageUri
    ) {
      deleteImage(oldVoci.imageUri);
    }

    setVociList(
      vociList.map((voci) => (voci.term === term ? updatedVoci : voci))
    );
  };

  const removeVoci = (term: string) => {
    const oldVoci = vociList.find((voci) => voci.term === term);

    if (oldVoci?.imageUri) {
      deleteImage(oldVoci.imageUri);
    }

    setVociList(vociList.filter((voci) => voci.term !== term));
  };

  return (
    <VociContext.Provider
      value={{ vociList, isLoading, addVoci, updateVoci, removeVoci }}
    >
      {children}
    </VociContext.Provider>
  );
}

export function useVoci() {
  const context = useContext(VociContext);

  if (!context) {
    throw new Error("useVoci muss innerhalb von VociProvider verwendet werden");
  }

  return context;
}