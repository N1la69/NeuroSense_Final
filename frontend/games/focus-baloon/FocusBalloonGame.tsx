import { useEffect, useRef, useState } from "react";
import { View, Dimensions } from "react-native";
import GameSessionManager from "@/games/engine/GameSessionManager";
import { attentionToLift } from "@/games/engine/NeuroAdapter";
import Balloon from "./Balloon";
import AttentionMeter from "@/games/components/AttentionMeter";

const HEIGHT = Dimensions.get("window").height;

export default function FocusBalloonGame({ onEnd }: any) {
  const [attention, setAttention] = useState(0);
  const [y, setY] = useState(HEIGHT / 2);

  const velocity = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);
  const attentionRef = useRef(0);

  // Start session
  useEffect(() => {
    let pollInterval: any;

    async function start() {
      await GameSessionManager.start("Focus Balloon");

      // Poll attention every 500ms
      pollInterval = setInterval(async () => {
        const att = await GameSessionManager.getAttention();
        attentionRef.current = att;
        setAttention(att);
      }, 500);

      startPhysics();
    }

    start();

    return () => {
      clearInterval(pollInterval);

      cancelAnimationFrame(animationRef.current!);

      GameSessionManager.stop();

      onEnd?.();
    };
  }, []);

  function startPhysics() {
    function loop() {
      const lift = attentionToLift(attentionRef.current);

      const gravity = 0.4;

      velocity.current += lift * 0.8;
      velocity.current -= gravity;

      velocity.current *= 0.98;

      setY((prev) => {
        let next = prev - velocity.current;

        if (next < 80) next = 80;

        if (next > HEIGHT - 120) next = HEIGHT - 120;

        return next;
      });

      animationRef.current = requestAnimationFrame(loop);
    }

    animationRef.current = requestAnimationFrame(loop);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      <AttentionMeter attention={attention} />

      <Balloon y={y} />
    </View>
  );
}
