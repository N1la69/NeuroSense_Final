import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import GameSessionManager from "@/games/engine/GameSessionManager";
import ColorGrid from "./ColorGrid";
import FindColorIntro from "./FindColorIntro";
import AttentionMeter from "@/games/components/AttentionMeter";

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

const SESSION_DURATION = 60000;
const ROUND_TIME = 5000;

export default function FindColorGame({ onEnd }: any) {
  const [started, setStarted] = useState(false);

  const [score, setScore] = useState(0);

  const [target, setTarget] = useState("red");

  const [grid, setGrid] = useState<string[]>([]);

  const [timeLeft, setTimeLeft] = useState(60);

  const [roundTime, setRoundTime] = useState(5);

  const [attention, setAttention] = useState(50);

  useEffect(() => {
    if (!started) return;

    startSession();
    nextRound();
  }, [started]);

  async function startSession() {
    const startTime = Date.now();

    await GameSessionManager.start("Find Color");

    const poll = setInterval(async () => {
      const att = await GameSessionManager.getAttention();

      setAttention(att);
    }, 500);

    const sessionTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;

      setTimeLeft(Math.max(0, Math.ceil((SESSION_DURATION - elapsed) / 1000)));
    }, 200);

    setTimeout(() => {
      clearInterval(poll);
      clearInterval(sessionTimer);

      GameSessionManager.stop();

      onEnd();
    }, SESSION_DURATION);
  }

  function nextRound() {
    const t = COLORS[Math.floor(Math.random() * COLORS.length)];

    setTarget(t);

    const newGrid = [];

    for (let i = 0; i < 12; i++) {
      newGrid.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }

    newGrid[Math.floor(Math.random() * 12)] = t;

    setGrid(newGrid);

    startRoundTimer();
  }

  function startRoundTimer() {
    setRoundTime(5);

    const timer = setInterval(() => {
      setRoundTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          setScore((s) => s - 5);

          nextRound();

          return 5;
        }

        return prev - 1;
      });
    }, 1000);
  }

  function handleSelect(color: string) {
    if (color === target) setScore((s) => s + 10);
    else setScore((s) => s - 5);

    nextRound();
  }

  if (!started) return <FindColorIntro onStart={() => setStarted(true)} />;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 40,
      }}
    >
      <Text style={{ fontSize: 22 }}>Time: {timeLeft}s</Text>

      <Text style={{ fontSize: 18 }}>Score: {score}</Text>

      <Text
        style={{
          fontSize: 20,
          marginTop: 10,
        }}
      >
        Find: {target.toUpperCase()}
      </Text>

      <Text>Round Time: {roundTime}s</Text>

      <AttentionMeter attention={attention} />

      <ColorGrid colors={grid} onSelect={handleSelect} />
    </View>
  );
}
