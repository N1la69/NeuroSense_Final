import { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import GameSessionManager from "@/games/engine/GameSessionManager";
import ColorGrid from "./ColorGrid";
import FindColorIntro from "./FindColorIntro";
import ColorGameBackground from "./ColorGameBackground";

const COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#a855f7", // purple
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
  "#f43f5e", // rose
  "#6366f1", // indigo
  "#14b8a6", // teal
];

const SESSION_DURATION = 60000;
const ROUND_TIME = 5000;

export default function FindColorGame({ onEnd }: any) {
  const roundTimerRef = useRef<number | null>(null);
  const sessionTimerRef = useRef<number | null>(null);
  const sessionEndedRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState("red");
  const [grid, setGrid] = useState<string[]>([]);

  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION / 1000);
  const [roundTime, setRoundTime] = useState(ROUND_TIME / 1000);

  const [difficulty, setDifficulty] = useState({
    gridSize: 12,
    colorCount: 6,
    roundTime: 10,
  });

  useEffect(() => {
    if (!started) return;

    startSession();
    nextRound();
  }, [started]);

  async function startSession() {
    const startTime = Date.now();

    await GameSessionManager.start("Find Color");

    sessionTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;

      setTimeLeft(Math.max(0, Math.ceil((SESSION_DURATION - elapsed) / 1000)));
    }, 250);

    setTimeout(() => {
      if (sessionEndedRef.current) return;

      sessionEndedRef.current = true;

      // stop round timer
      if (roundTimerRef.current !== null) {
        clearInterval(roundTimerRef.current);
        roundTimerRef.current = null;
      }

      // stop session timer
      if (sessionTimerRef.current !== null) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }

      GameSessionManager.stop();

      onEnd();
    }, SESSION_DURATION);
  }

  function updateDifficulty(newScore: number) {
    if (newScore >= 230) {
      setDifficulty({
        gridSize: 24,
        colorCount: 12,
        roundTime: 7,
      });
    } else if (newScore >= 130) {
      setDifficulty({
        gridSize: 20,
        colorCount: 10,
        roundTime: 8,
      });
    } else if (newScore >= 50) {
      setDifficulty({
        gridSize: 16,
        colorCount: 8,
        roundTime: 9,
      });
    } else {
      setDifficulty({
        gridSize: 12,
        colorCount: 6,
        roundTime: 10,
      });
    }
  }

  function nextRound(diff = difficulty) {
    const usableColors = COLORS.slice(0, diff.colorCount);
    const t = usableColors[Math.floor(Math.random() * usableColors.length)];

    setTarget(t);

    const newGrid = [];

    for (let i = 0; i < diff.gridSize; i++) {
      newGrid.push(
        usableColors[Math.floor(Math.random() * usableColors.length)],
      );
    }

    newGrid[Math.floor(Math.random() * newGrid.length)] = t;

    setGrid(newGrid);

    startRoundTimer();
  }

  function startRoundTimer() {
    // CLEAR any existing timer first
    if (roundTimerRef.current) {
      clearInterval(roundTimerRef.current);
    }

    setRoundTime(difficulty.roundTime);

    roundTimerRef.current = setInterval(() => {
      setRoundTime((prev) => {
        if (prev <= 1) {
          // stop current timer
          if (roundTimerRef.current) {
            clearInterval(roundTimerRef.current);
            roundTimerRef.current = null;
          }

          setScore((prev) => {
            const newScore = Math.max(0, prev - 5);

            updateDifficulty(newScore);

            nextRound({
              gridSize:
                newScore >= 230
                  ? 24
                  : newScore >= 130
                    ? 20
                    : newScore >= 50
                      ? 16
                      : 12,

              colorCount:
                newScore >= 230
                  ? 12
                  : newScore >= 130
                    ? 10
                    : newScore >= 50
                      ? 8
                      : 6,

              roundTime:
                newScore >= 230
                  ? 7
                  : newScore >= 130
                    ? 8
                    : newScore >= 50
                      ? 9
                      : 10,
            });

            return newScore;
          });

          return difficulty.roundTime;
        }

        return prev - 1;
      });
    }, 1000);
  }

  function handleSelect(color: string) {
    // stop existing timer
    if (roundTimerRef.current) {
      clearInterval(roundTimerRef.current);
      roundTimerRef.current = null;
    }

    setScore((prev) => {
      const newScore = color === target ? prev + 10 : Math.max(0, prev - 5);

      updateDifficulty(newScore);

      nextRound({
        gridSize:
          newScore >= 230
            ? 24
            : newScore >= 130
              ? 20
              : newScore >= 50
                ? 16
                : 12,

        colorCount:
          newScore >= 230 ? 12 : newScore >= 130 ? 10 : newScore >= 50 ? 8 : 6,

        roundTime:
          newScore >= 230 ? 7 : newScore >= 130 ? 8 : newScore >= 50 ? 9 : 10,
      });

      return newScore;
    });
  }

  useEffect(() => {
    return () => {
      if (roundTimerRef.current !== null) clearInterval(roundTimerRef.current);

      if (sessionTimerRef.current !== null)
        clearInterval(sessionTimerRef.current);
    };
  }, []);

  if (!started) return <FindColorIntro onStart={() => setStarted(true)} />;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 40,
      }}
    >
      <ColorGameBackground />

      <Text style={{ fontSize: 22 }}>Time: {timeLeft}s</Text>

      <Text style={{ fontSize: 18 }}>Score: {score}</Text>

      <Text
        style={{
          fontSize: 14,
          color: "#64748b",
        }}
      >
        Difficulty:{" "}
        {difficulty.gridSize === 12
          ? "Easy"
          : difficulty.gridSize === 16
            ? "Medium"
            : difficulty.gridSize === 20
              ? "Hard"
              : "Expert"}
      </Text>

      <View
        style={{
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#64748b",
          }}
        >
          Find this color
        </Text>

        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: target,
            marginTop: 10,
            borderWidth: 3,
            borderColor: "white",
          }}
        />
      </View>

      <Text>Round Time: {roundTime}s</Text>

      <ColorGrid colors={grid} onSelect={handleSelect} />
    </View>
  );
}
