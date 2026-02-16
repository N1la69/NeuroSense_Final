import { View, Text, Pressable } from "react-native";

export default function FindColorIntro({ onStart }: any) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
        }}
      >
        Find the Color
      </Text>

      <Text
        style={{
          marginTop: 20,
          textAlign: "center",
        }}
      >
        Find and tap the requested color as fast as possible. Correct: +10
        points Wrong or timeout: -5 points
      </Text>

      <Pressable
        onPress={onStart}
        style={{
          marginTop: 30,
          backgroundColor: "#4f7cff",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white" }}>Start Session</Text>
      </Pressable>
    </View>
  );
}
