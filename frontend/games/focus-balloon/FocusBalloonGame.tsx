import { useEffect, useRef, useState } from "react";
import { View, Dimensions, Text } from "react-native";
import GameSessionManager from "@/games/engine/GameSessionManager";
import { attentionToLift } from "@/games/engine/NeuroAdapter";
import Balloon from "./Balloon";
import AttentionMeter from "@/games/components/AttentionMeter";
import ThemeManager from "../engine/ThemeManager";
import Background from "./Background";
import Obstacle from "./Obstacle";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const SESSION_DURATION = 60000;

const TOP_LIMIT = 160;
const BOTTOM_LIMIT = HEIGHT - 140;

const OBSTACLE_SPEED = 2;
const GAP = 160;

export default function FocusBalloonGame({ onEnd }: any) {
  const [attention, setAttention] = useState(50);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [y, setY] = useState(HEIGHT / 2);

  const velocity = useRef(0);
  const attentionRef = useRef(50);
  const animationRef = useRef<number>(0);

  const obstaclesRef = useRef<any[]>([]);
  const yRef = useRef(y);

  const timersRef = useRef<any[]>([]);

  useEffect(() => {
    ThemeManager.setTheme("calm");

    startSession();

    spawnObstacles();

    return cleanup;
  }, []);

  useEffect(() => {
    obstaclesRef.current = obstacles;
  }, [obstacles]);

  useEffect(() => {
    yRef.current = y;
  }, [y]);

  async function startSession() {
    const startTime = Date.now();

    await GameSessionManager.start("Focus Balloon");

    // attention polling
    const poll = setInterval(async () => {
      const att = await GameSessionManager.getAttention();

      attentionRef.current = att;
      setAttention(att);
    }, 300);

    timersRef.current.push(poll);

    // session timer
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;

      const remaining = Math.max(
        0,
        Math.ceil((SESSION_DURATION - elapsed) / 1000),
      );

      setTimeLeft(remaining);
    }, 200);

    timersRef.current.push(timer);

    // end session
    const endTimer = setTimeout(async () => {
      await GameSessionManager.stop();

      setTimeout(() => {
        onEnd?.();
      }, 1500);
    }, SESSION_DURATION);

    timersRef.current.push(endTimer);

    startPhysics();
  }

  function spawnObstacles() {
    const spawn = setInterval(() => {
      setObstacles((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: WIDTH,
          gapY: 180 + Math.random() * 240,
        },
      ]);
    }, 2800);

    timersRef.current.push(spawn);
  }

  function startPhysics() {
    function loop() {
      const attentionVal = attentionRef.current;

      const lift = attentionToLift(attentionVal);

      const difficulty = attentionVal / 100;

      const gravity = 0.45 + difficulty * 0.25;

      velocity.current += lift * 0.9;
      velocity.current -= gravity;

      velocity.current *= 0.98;

      const currentY = yRef.current;

      // move obstacles
      setObstacles((prev) =>
        prev
          .map((o) => ({
            ...o,
            x: o.x - OBSTACLE_SPEED,
          }))
          .filter((o) => o.x > -80),
      );

      // collision detection
      obstaclesRef.current.forEach((o) => {
        const balloonX = WIDTH / 2;

        if (
          balloonX > o.x &&
          balloonX < o.x + 60 &&
          (currentY < o.gapY || currentY > o.gapY + GAP)
        ) {
          velocity.current = -6;
        }
      });

      setY((prev) => {
        let next = prev - velocity.current;

        if (next < TOP_LIMIT) next = TOP_LIMIT;
        if (next > BOTTOM_LIMIT) next = BOTTOM_LIMIT;

        return next;
      });

      // score accumulation
      setScore((prev) => prev + attentionVal * 0.02);

      animationRef.current = requestAnimationFrame(loop);
    }

    animationRef.current = requestAnimationFrame(loop);
  }

  function cleanup() {
    timersRef.current.forEach(clearInterval);

    timersRef.current = [];

    cancelAnimationFrame(animationRef.current!);

    GameSessionManager.stop();
  }

  return (
    <View style={{ flex: 1 }}>
      <Background />

      {/* TOP HUD */}
      <View
        style={{
          position: "absolute",
          top: 50,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#111",
          }}
        >
          Time: {timeLeft}s
        </Text>

        <Text
          style={{
            fontSize: 18,
            marginTop: 4,
            fontWeight: "600",
            color: "#222",
          }}
        >
          Score: {Math.floor(score)}
        </Text>
      </View>

      <AttentionMeter attention={attention} />

      <Balloon y={y} attention={attention} />

      {obstacles.map((o) => (
        <Obstacle key={o.id} x={o.x} gapY={o.gapY} />
      ))}
    </View>
  );
}
