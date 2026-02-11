import { View, Text } from "react-native";

export default function ProgressTrend({ scores }: { scores: number[] }) {
  if (!scores.length) return <Text>No data</Text>;

  return (
    <View>
      {scores.map((s, i) => (
        <View
          key={i}
          style={{
            height: 6,
            backgroundColor: "#4f7cff",
            width: `${Math.round(s * 100)}%`,
            marginVertical: 4,
            borderRadius: 4,
          }}
        />
      ))}
    </View>
  );
}
