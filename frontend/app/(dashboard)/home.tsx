import { View, Text, ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import AppShell from "../../components/AppShell";
import ProgressTrend from "../../components/ProgressTrend";

import { getDashboard, getLiveInterpreted } from "../../utils/api";
import { getChild } from "../../utils/storage";

export default function HomeScreen() {
  const router = useRouter();

  const [scores, setScores] = useState<number[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [nsi, setNsi] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  function interpretOverallProgress(scores: number[]) {
    const first = Math.round(scores[0] * 100);
    const last = Math.round(scores[scores.length - 1] * 100);

    if (scores.length < 2)
      return `Training has just started. Current focus level is ${last}%.`;

    if (last - first > 5)
      return `Positive improvement observed: Focus increased from ${first}% to ${last}%.`;

    if (last - first < -5)
      return `Some variation seen: Focus changed from ${first}% to ${last}%. This is normal during therapy.`;

    return `Focus level has remained stable around ${last}%.`;
  }

  function latestLabel(score: number) {
    if (score >= 0.7) return { label: "Strong Focus", color: "#2e7d32" };
    if (score >= 0.55) return { label: "Improving", color: "#ed6c02" };
    return { label: "Needs Practice", color: "#d32f2f" };
  }

  function interpretNSI(label: string) {
    if (label === "STABLE")
      return { label: "Stable Neural Response", color: "#2e7d32" };

    if (label === "MODERATE")
      return { label: "Developing Regulation", color: "#ed6c02" };

    return { label: "High Variability", color: "#d32f2f" };
  }

  useEffect(() => {
    async function load() {
      const childId = await getChild();

      const dash = await getDashboard(childId!);

      setScores(dash.scores || []);
      setSessions(dash.sessions || []);
      setNsi(dash.nsi);

      // Use latest live interpreted as recommendation source
      const rec = await getLiveInterpreted();
      setRecommendation(rec);
    }

    load().catch(console.error);
  }, []);

  if (!scores.length) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading progress…</Text>
      </View>
    );
  }

  const insight = interpretOverallProgress(scores);
  const latest = latestLabel(scores[scores.length - 1]);

  return (
    <AppShell>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          Your Child's Therapy Progress
        </Text>

        {/* Insight Card */}
        <View
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#f5f7ff",
          }}
        >
          <Text style={{ fontWeight: "600" }}>{insight}</Text>
        </View>

        {/* Trend */}
        <View
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#f5f7ff",
          }}
        >
          <ProgressTrend scores={scores} />
        </View>

        {/* Latest Session */}
        <View
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#f5f7ff",
          }}
        >
          <Text style={{ fontWeight: "600" }}>Latest Session Summary</Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 28,
              fontWeight: "700",
              color: latest.color,
            }}
          >
            {Math.round(scores[scores.length - 1] * 100)}%
          </Text>

          <Text
            style={{ marginTop: 6, fontWeight: "600", color: latest.color }}
          >
            {latest.label}
          </Text>
        </View>

        {/* NSI */}
        {nsi && (
          <View
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#eef2ff",
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              Neural Response Stability Index
            </Text>

            {(() => {
              const info = interpretNSI(nsi);
              return (
                <>
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 24,
                      fontWeight: "800",
                      color: info.color,
                    }}
                  >
                    {info.label}
                  </Text>
                </>
              );
            })()}
          </View>
        )}

        {/* Recommendation */}
        {recommendation && recommendation.next_games && (
          <View
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#eef2ff",
            }}
          >
            <Text style={{ fontWeight: "700" }}>Recommended Next Activity</Text>

            {recommendation.next_games.map((g: string) => (
              <Text key={g} style={{ marginTop: 6 }}>
                • {g}
              </Text>
            ))}
          </View>
        )}

        {/* Sessions */}
        <Text style={{ marginTop: 28, fontSize: 18, fontWeight: "600" }}>
          Session Reports
        </Text>

        {sessions.map((s, i) => (
          <Pressable
            key={s}
            onPress={() => router.push(`/session/${s}` as any)}
            style={{
              marginTop: 12,
              padding: 16,
              borderRadius: 10,
              backgroundColor: "#f6f8ff",
            }}
          >
            <Text style={{ fontWeight: "600" }}>Session {i + 1}</Text>

            <Text style={{ marginTop: 4 }}>
              Focus Level: {Math.round(scores[i] * 100)}%
            </Text>

            <Text style={{ marginTop: 4, color: "#4f7cff", fontWeight: "600" }}>
              View detailed report →
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </AppShell>
  );
}
