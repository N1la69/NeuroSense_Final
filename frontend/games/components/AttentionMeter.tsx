import { View, Text } from "react-native";

export default function AttentionMeter({ attention }: { attention: number }) {
  const color =
    attention >= 70 ? "#22c55e" : attention >= 55 ? "#f59e0b" : "#ef4444";

  return (
    <View
      style={{
        position: "absolute",
        top: 90,
        alignSelf: "center",
        width: 200,
      }}
    >
      <Text style={{ textAlign: "center", fontWeight: "600" }}>
        Attention: {attention}
      </Text>

      <View
        style={{
          height: 12,
          backgroundColor: "#e5e7eb",
          borderRadius: 6,
          marginTop: 6,
        }}
      >
        <View
          style={{
            width: `${attention}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 6,
          }}
        />
      </View>
    </View>
  );
}
