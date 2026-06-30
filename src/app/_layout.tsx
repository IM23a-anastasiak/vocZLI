import {Pressable} from "react-native";
import {Stack, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {VociProvider} from "../context/vociContext";

export default function RootLayout() {
    const router = useRouter();

    return (
        <VociProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#ac4caf",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Meine Vokabeln",
                        headerRight: () => (
                            <Pressable onPress={() => router.push("/addVoci")}>
                                <Ionicons name="add" size={28} color="#fff"/>
                            </Pressable>
                        ),
                    }}
                />

                <Stack.Screen
                    name="learn"
                    options={{
                        title: "Vokabeln lernen",
                    }}
                />

                <Stack.Screen
                    name="addVoci"
                    options={{
                        title: "Neue Vokabel",
                        presentation: "modal",
                    }}
                />
                <Stack.Screen
                    name="editVoci"
                    options={{
                        title: "Vokabel bearbeiten",
                        presentation: "modal",
                    }}
                />

            </Stack>

        </VociProvider>
    );
}