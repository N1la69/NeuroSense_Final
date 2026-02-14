import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function ProgressTrend({ scores }: { scores: number[] }) {
  if (!scores.length) return <Text>No data</Text>;

  const data = scores.map((s, i) => ({
    value: Math.round(s * 100),
    label: `S${i + 1}`,
    frontColor: s >= 0.7 ? "#2e7d32" : s >= 0.55 ? "#ed6c02" : "#d32f2f",
  }));

  return (
    <View style={{ marginTop: 10 }}>
      <BarChart
        data={data}
        height={220}
        barWidth={28}
        spacing={20}
        roundedTop
        hideRules={false}
        xAxisThickness={1}
        yAxisThickness={1}
        yAxisTextStyle={{ color: "#555" }}
        xAxisLabelTextStyle={{ color: "#555" }}
        noOfSections={4}
        maxValue={100}
        isAnimated
      />

      <Text style={{ marginTop: 12, fontWeight: "600" }}>
        Overall Trend:{" "}
        {scores[scores.length - 1] > scores[0]
          ? "Improving 📈"
          : scores[scores.length - 1] < scores[0]
            ? "Slight Variation 📉"
            : "Stable ➖"}
      </Text>
    </View>
  );
}
