import { View, Text, ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  interpretNSIScore,
  interpretOverallProgress,
  latestLabel,
} from "@/utils/helpers";
import AppShell from "@/components/ui/AppShell";
import { getChild } from "@/utils/storage";
import { getDashboard, getLiveInterpreted } from "@/utils/api";
import ProgressTrend from "@/components/ProgressTrend";
import TopBar from "@/components/ui/TopBar";

const HomeScreen = () => {
  const router = useRouter();

  const [scores, setScores] = useState<number[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [nsi, setNsi] = useState<number | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<any>(null);

  const load = async () => {
    const childId = await getChild();

    const dash = await getDashboard(childId!);

    setScores(dash.scores || []);
    setSessions(dash.sessions || []);
    setNsi(dash.latest_nsi ?? null);
    setSummary(dash.latest_summary ?? null);
    setTotalSessions(dash.total_sessions ?? 0);

    const rec = await getLiveInterpreted();
    setRecommendation(rec);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const insight = interpretOverallProgress(scores);
  const latest = latestLabel(scores[scores.length - 1]);

  if (totalSessions === 0) {
    return (
      <AppShell>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "700" }}>
            Welcome to NeuroSense 👋
          </Text>

          <View
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#f5f7ff",
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              NeuroSense uses AI-powered neural analysis to monitor your child's
              attention patterns.
            </Text>

            <Text style={{ marginTop: 10 }}>
              Start your first session to establish a neural baseline.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/start" as any)}
            style={{
              marginTop: 24,
              backgroundColor: "#4f7cff",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "700" }}
            >
              Start First Session
            </Text>
          </Pressable>
        </ScrollView>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar />
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
        {nsi !== null && summary && (
          <View
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#eef2ff",
            }}
          >
            <Text style={{ fontWeight: "700" }}>Neural Stability Index</Text>

            {(() => {
              const info = interpretNSIScore(nsi);
              return (
                <>
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 34,
                      fontWeight: "800",
                      color: info.color,
                    }}
                  >
                    {nsi.toFixed(1)} / 100
                  </Text>

                  <Text style={{ fontWeight: "700", color: info.color }}>
                    {info.label}
                  </Text>

                  <Text style={{ marginTop: 6 }}>{info.explanation}</Text>
                </>
              );
            })()}
          </View>
        )}

        {/* SUMMARY BREAKDOWN */}
        {summary && (
          <View
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#f5f7ff",
            }}
          >
            <Text style={{ fontWeight: "700" }}>Session Breakdown</Text>

            <Text style={{ marginTop: 8 }}>
              AI Confidence: {summary.calibrated_confidence_mean.toFixed(1)}%
            </Text>

            <Text>
              Biomarker Strength: {summary.biomarker_score_mean.toFixed(1)}%
            </Text>

            <Text>Stability Score: {summary.stability_score.toFixed(1)}%</Text>

            <Text>
              Signal Quality: {summary.signal_quality_mean.toFixed(1)}%
            </Text>

            <Text style={{ marginTop: 8, fontWeight: "600" }}>
              Reliability Ratio: {summary.reliability_ratio}
            </Text>

            <Text>
              Windows Used: {summary.windows_used} / {summary.windows_total}
            </Text>
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

        {/* SESSION BUTTONS */}
        <Pressable
          onPress={() => router.push("/start" as any)}
          style={{
            marginTop: 28,
            backgroundColor: "#4f7cff",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "700" }}
          >
            Start New Session
          </Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
};

export default HomeScreen;
