import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function ResultScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eef2ff",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
        }}
      >
        Session Complete
      </Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
        }}
      >
        NeuroSense is analyzing neural data...
      </Text>

      <Pressable
        onPress={() => router.replace("/(dashboard)/home")}
        style={{
          marginTop: 30,
          backgroundColor: "#4f7cff",
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>View Results</Text>
      </Pressable>
    </View>
  );
}
