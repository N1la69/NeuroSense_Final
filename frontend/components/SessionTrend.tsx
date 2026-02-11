import { View } from "react-native";

export default function SessionTrend({ values }: { values: number[] }) {
  if (!values?.length) return null;

  return (
    <View style={{ marginVertical: 10 }}>
      {values.slice(-40).map((v, i) => (
        <View
          key={i}
          style={{
            height: 4,
            width: `${Math.round(v * 100)}%`,
            backgroundColor: "#4f7cff",
            marginVertical: 2,
            borderRadius: 4,
          }}
        />
      ))}
    </View>
  );
}
