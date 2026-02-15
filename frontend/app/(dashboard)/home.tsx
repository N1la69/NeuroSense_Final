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
import ProgressTrend from "@/components/homepage/ProgressTrend";
import TopBar from "@/components/ui/TopBar";
import InsightCard from "@/components/homepage/InsightCard";
import { Ionicons } from "@expo/vector-icons";
import LatestSessionCard from "@/components/homepage/LatestSessionCard";
import NsiCard from "@/components/homepage/NsiCard";
import NeuralAnalysisCard from "@/components/homepage/NeuralAnalysisCard";
import SessionReports from "@/components/homepage/SessionReports";

const HomeScreen = () => {
  const router = useRouter();

  const [scores, setScores] = useState<number[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  // const [nsi, setNsi] = useState<number | null>(null);
  // const [summary, setSummary] = useState<any>(null);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<any>(null);

  const [latestSession, setLatestSession] = useState<{
    nsi: number | null;
    normalized_nsi: number | null;
    baseline_nsi: number | null;
    delta_from_baseline: number | null;
    summary: any;
  } | null>(null);

  const load = async () => {
    const childId = await getChild();

    const dash = await getDashboard(childId!);

    setScores(dash.scores || []);
    setSessions(dash.sessions || []);
    // setNsi(dash.latest_nsi ?? null);
    // setSummary(dash.latest_summary ?? null);
    setLatestSession({
      nsi: dash.latest_nsi ?? null,
      normalized_nsi: dash.latest_normalized_nsi ?? null,
      baseline_nsi: dash.latest_baseline_nsi ?? null,
      delta_from_baseline: dash.latest_delta_from_baseline ?? null,
      summary: dash.latest_summary ?? null,
    });
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

          {/* GAME BUTTONS */}
          <Pressable
            onPress={() => router.push("/games/play/focus-balloon" as any)}
            style={{
              marginTop: 16,
              backgroundColor: "#22c55e",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "700" }}
            >
              Play Focus Balloon Game
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
        <InsightCard insight={insight} />

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
        <LatestSessionCard latest={latest} scores={scores} />

        {/* Neural Stability Index */}
        {latestSession?.nsi !== null && latestSession?.summary && (
          <NsiCard
            nsi={latestSession.nsi}
            normalized_nsi={latestSession.normalized_nsi}
            baseline_nsi={latestSession.baseline_nsi}
            delta_from_baseline={latestSession.delta_from_baseline}
            summary={latestSession.summary}
          />
        )}

        {/* Neural Analysis Breakdown */}
        {latestSession?.summary && (
          <NeuralAnalysisCard summary={latestSession.summary} />
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

        {/* Session Reports */}
        <SessionReports sessions={sessions} scores={scores} />

        {/* GAME BUTTONS */}
        <Pressable
          onPress={() => router.push("/games/play/focus-balloon" as any)}
          style={{
            marginTop: 16,
            backgroundColor: "#22c55e",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "700" }}
          >
            Play Focus Balloon Game
          </Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
};

export default HomeScreen;
