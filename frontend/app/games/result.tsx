import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function ResultScreen() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [seconds, setSeconds] = useState(35);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setReady(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eef2ff",
        padding: 30,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 10,
        }}
      >
        Session Complete
      </Text>

      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        NeuroSense is analyzing neural patterns...
      </Text>

      <Pressable
        disabled={!ready}
        onPress={() => router.replace("/(dashboard)/home")}
        style={{
          backgroundColor: ready ? "#4f7cff" : "#94a3b8",
          padding: 16,
          borderRadius: 12,
          width: 200,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {ready ? "View Results" : `Please wait ${seconds}s`}
        </Text>
      </Pressable>
    </View>
  );
}
