import { View, Text, ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { interpretOverallProgress, latestLabel } from "@/utils/helpers";
import AppShell from "@/components/ui/AppShell";
import { getChild } from "@/utils/storage";
import {
  getDashboard,
  getLiveInterpreted,
  getRecommendation,
} from "@/utils/api";
import ProgressTrend from "@/components/homepage/ProgressTrend";
import TopBar from "@/components/ui/TopBar";
import InsightCard from "@/components/homepage/InsightCard";
import LatestSessionCard from "@/components/homepage/LatestSessionCard";
import NsiCard from "@/components/homepage/NsiCard";
import NeuralAnalysisCard from "@/components/homepage/NeuralAnalysisCard";
import SessionReports from "@/components/homepage/SessionReports";

const HomeScreen = () => {
  const router = useRouter();

  const [scores, setScores] = useState<number[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<{
    recommended_game?: string;
    difficulty?: string;
    reason?: string;
  } | null>(null);

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
    setLatestSession({
      nsi: dash.latest_nsi ?? null,
      normalized_nsi: dash.latest_normalized_nsi ?? null,
      baseline_nsi: dash.latest_baseline_nsi ?? null,
      delta_from_baseline: dash.latest_delta_from_baseline ?? null,
      summary: dash.latest_summary ?? null,
    });
    setTotalSessions(dash.total_sessions ?? 0);

    const rec = await getRecommendation(childId!);
    if (rec && rec.recommended_game) {
      setRecommendation(rec);
    } else {
      setRecommendation(null);
    }
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
          <View
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#eef2ff",
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                marginBottom: 10,
                fontSize: 16,
              }}
            >
              Start Therapy Session
            </Text>

            <Pressable
              onPress={() => router.push("/games/play/follow-ball")}
              style={{
                backgroundColor: "#4f7cff",
                padding: 14,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Begin Follow-Ball Therapy
              </Text>
            </Pressable>

            <Text
              style={{
                fontSize: 12,
                color: "#64748b",
                textAlign: "center",
              }}
            >
              Theme adapts automatically based on attention stability
            </Text>
          </View>
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
        {recommendation?.recommended_game && (
          <View
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              backgroundColor: "#eef2ff",
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16 }}>
              Recommended Therapy
            </Text>

            <Text style={{ marginTop: 8 }}>
              Game: {String(recommendation.recommended_game).replace(/_/g, " ")}
            </Text>

            <Text>Difficulty: {recommendation?.difficulty ?? "medium"}</Text>

            <Text style={{ marginTop: 6, color: "#64748b" }}>
              {recommendation?.reason ?? "Based on neural attention analysis"}
            </Text>

            <Pressable
              onPress={() => {
                const game = recommendation.recommended_game;

                if (game === "follow_the_ball") {
                  router.push("/games/play/follow-ball");
                } else if (game === "find_the_color") {
                  router.push("/games/play/find-color");
                }
              }}
              style={{
                marginTop: 12,
                backgroundColor: "#4f7cff",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Start Recommended Therapy
              </Text>
            </Pressable>
          </View>
        )}

        {/* Session Reports */}
        <SessionReports sessions={sessions} scores={scores} />

        {/* GAME BUTTONS */}
        <View
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#eef2ff",
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              marginBottom: 10,
              fontSize: 16,
            }}
          >
            Start Therapy Session
          </Text>

          <Pressable
            onPress={() => router.push("/games/play/follow-ball")}
            style={{
              backgroundColor: "#4f7cff",
              padding: 14,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Begin Follow-Ball Therapy
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/games/play/find-color")}
            style={{
              marginTop: 12,
              backgroundColor: "#22c55e",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              Test Game: Find the Color
            </Text>
          </Pressable>

          <Text
            style={{
              fontSize: 12,
              color: "#64748b",
              textAlign: "center",
            }}
          >
            Theme adapts automatically based on attention stability
          </Text>
        </View>
      </ScrollView>
    </AppShell>
  );
};

export default HomeScreen;
