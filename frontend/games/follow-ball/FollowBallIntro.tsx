import { View, Text, Pressable } from "react-native";

export default function FollowBallIntro({ onStart }: any) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
        backgroundColor: "#eef2ff",
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          marginBottom: 20,
        }}
      >
        Follow the Ball
      </Text>

      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          marginBottom: 30,
          lineHeight: 22,
        }}
      >
        Focus your eyes on the moving ball.
        {"\n\n"}
        Try to follow it carefully as it changes direction and color.
        {"\n\n"}
        This helps NeuroSense measure and train attention.
      </Text>

      <Pressable
        onPress={onStart}
        style={{
          backgroundColor: "#4f7cff",
          padding: 16,
          borderRadius: 12,
          width: 200,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          Start Session
        </Text>
      </Pressable>
    </View>
  );
}
