import { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import GameSessionManager from "@/games/engine/GameSessionManager";
import FollowBall from "./FollowBall";
import AttentionMeter from "@/games/components/AttentionMeter";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const SESSION_DURATION = 60000;

export default function FollowBallGame({ onEnd }: any) {
  const [attention, setAttention] = useState(50);
  const attentionRef = useRef(50);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const [ball, setBall] = useState({
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: 2,
    vy: 2,
    color: "#4f7cff",
  });

  const animationRef = useRef<number>(0);

  useEffect(() => {
    startSession();

    startPhysics();

    const colorTimer = setInterval(changeColor, 2000);

    return () => {
      cancelAnimationFrame(animationRef.current!);
      clearInterval(colorTimer);
      GameSessionManager.stop();
    };
  }, []);

  async function startSession() {
    const startTime = Date.now();

    await GameSessionManager.start("Follow Ball");

    const poll = setInterval(async () => {
      const att = await GameSessionManager.getAttention();

      attentionRef.current = att;
      setAttention(att);
    }, 300);

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;

      const remaining = Math.max(
        0,
        Math.ceil((SESSION_DURATION - elapsed) / 1000),
      );

      setTimeLeft(remaining);
    }, 200);

    setTimeout(async () => {
      clearInterval(poll);
      clearInterval(timer);

      await GameSessionManager.stop();

      setTimeout(onEnd, 1500);
    }, SESSION_DURATION);
  }

  function startPhysics() {
    function loop() {
      const att = attentionRef.current;

      const speedMultiplier = 0.5 + att / 100;

      setBall((prev) => {
        let nx = prev.x + prev.vx * speedMultiplier;
        let ny = prev.y + prev.vy * speedMultiplier;

        let vx = prev.vx;
        let vy = prev.vy;

        if (nx < 40 || nx > WIDTH - 40) vx *= -1;

        if (ny < 120 || ny > HEIGHT - 40) vy *= -1;

        return {
          ...prev,
          x: nx,
          y: ny,
          vx,
          vy,
        };
      });

      setScore((prev) => prev + att * 0.02);

      animationRef.current = requestAnimationFrame(loop);
    }

    animationRef.current = requestAnimationFrame(loop);
  }

  function changeColor() {
    const colors = ["#4f7cff", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

    setBall((prev) => ({
      ...prev,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      <Text
        style={{
          position: "absolute",
          top: 40,
          alignSelf: "center",
          fontSize: 22,
          fontWeight: "700",
        }}
      >
        Time: {timeLeft}s
      </Text>

      <Text
        style={{
          position: "absolute",
          top: 70,
          alignSelf: "center",
          fontSize: 18,
          fontWeight: "600",
        }}
      >
        Score: {Math.floor(score)}
      </Text>

      <AttentionMeter attention={attention} />

      <FollowBall x={ball.x} y={ball.y} size={60} color={ball.color} />
    </View>
  );
}
