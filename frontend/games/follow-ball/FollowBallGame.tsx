import { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import GameSessionManager from "@/games/engine/GameSessionManager";
import FollowBall from "./FollowBall";
import AttentionMeter from "@/games/components/AttentionMeter";
import ThemeManager from "../engine/ThemeManager";
import TherapyBackground from "./TherapyBackground";
import FollowBallIntro from "./FollowBallIntro";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const SESSION_DURATION = 60000;

export default function FollowBallGame({ onEnd }: any) {
  const attentionRef = useRef(50);
  const stableAttentionRef = useRef(0);
  const sessionStoppedRef = useRef(false);

  const [started, setStarted] = useState(false);

  const [attention, setAttention] = useState(50);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION / 1000);

  const [ball, setBall] = useState({
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: 2,
    vy: 2,
    color: "#4f7cff",
  });

  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!started) return;

    startSession();
    startPhysics();

    const colorTimer = setInterval(changeColor, 2000);

    return () => {
      cancelAnimationFrame(animationRef.current);

      clearInterval(colorTimer);

      GameSessionManager.stop();
    };
  }, [started]);

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

    setTimeout(() => {
      if (sessionStoppedRef.current) return;

      sessionStoppedRef.current = true;

      clearInterval(poll);
      clearInterval(timer);

      cancelAnimationFrame(animationRef.current);

      GameSessionManager.stop();

      onEnd();
    }, SESSION_DURATION);
  }

  function startPhysics() {
    function loop() {
      const att = attentionRef.current;

      if (att > 70) stableAttentionRef.current++;
      else stableAttentionRef.current = 0;

      if (stableAttentionRef.current > 600) ThemeManager.setTheme("fun");

      if (stableAttentionRef.current < 120) ThemeManager.setTheme("calm");

      const theme = ThemeManager.getTheme();

      const difficulty = (0.6 + att / 80) * theme.speedMultiplier;
      const speedMultiplier = difficulty;

      setBall((prev) => {
        let nx = prev.x + prev.vx * speedMultiplier;
        let ny = prev.y + prev.vy * speedMultiplier;

        let vx = prev.vx;
        let vy = prev.vy;

        const radius = 30;

        if (nx < 40 || nx > WIDTH - radius) vx *= -1;

        if (ny < 120 || ny > HEIGHT - radius) vy *= -1;

        return {
          ...prev,
          x: nx,
          y: ny,
          vx,
          vy,
        };
      });

      animationRef.current = requestAnimationFrame(loop);
    }

    animationRef.current = requestAnimationFrame(loop);
  }

  function changeColor() {
    const theme = ThemeManager.getTheme();
    const colors = theme.ballColors;

    setBall((prev) => ({
      ...prev,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  if (!started) {
    return <FollowBallIntro onStart={() => setStarted(true)} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      <TherapyBackground />

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

      <AttentionMeter attention={attention} />

      <FollowBall x={ball.x} y={ball.y} size={60} color={ball.color} />
    </View>
  );
}
