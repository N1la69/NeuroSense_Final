import AppShell from "@/components/ui/AppShell";
import SessionTrend from "@/components/SessionTrend";
import { getSessionDetail } from "@/utils/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

export default function SessionDetail() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getSessionDetail(id as string).then(setData);
  }, [id]);

  function nsiInfo(label: string) {
    if (label === "STABLE")
      return "Responses were consistent and well regulated during this session.";

    if (label === "MODERATE")
      return "Attention showed developing stability with some variations.";

    if (label === "FLUCTUATING")
      return "High variability was observed – this is common in early sessions.";

    return "Not enough data for stability analysis.";
  }

  if (!data) return <Text style={{ padding: 20 }}>Loading…</Text>;

  const s = data.summary || {};

  return (
    <AppShell>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Session Report</Text>

        <Text style={{ marginTop: 4 }}>Game: {data.game}</Text>

        {/* TREND */}
        <View
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            backgroundColor: "#f5f7ff",
          }}
        >
          <Text style={{ fontWeight: "600" }}>Attention Trend</Text>

          <SessionTrend values={data.trend} />
        </View>

        {/* SUMMARY */}
        <View
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            backgroundColor: "#f5f7ff",
          }}
        >
          <Text style={{ fontWeight: "600" }}>Session Summary</Text>

          <Text style={{ marginTop: 6 }}>
            Mean Attention: {s.mean_attention?.toFixed(1)}
          </Text>

          <Text>Max: {s.max_attention?.toFixed(1)}</Text>
          <Text>Min: {s.min_attention?.toFixed(1)}</Text>
          <Text>Windows: {s.windows}</Text>
        </View>

        {/* NSI */}
        <View
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            backgroundColor: "#eef2ff",
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            Neural Stability: {data.nsi}
          </Text>

          <Text style={{ marginTop: 6 }}>{nsiInfo(data.nsi)}</Text>
        </View>

        {/* PARENT MESSAGE */}
        <View
          style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            backgroundColor: "#f0fdf4",
          }}
        >
          <Text style={{ fontWeight: "700" }}>What This Means</Text>

          <Text style={{ marginTop: 6 }}>
            This report reflects your child’s attention response during one
            therapy activity. Scores may vary between sessions and gradual
            improvement over time is more important than any single value.
          </Text>
        </View>
      </ScrollView>
    </AppShell>
  );
}
