import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import GameSessionManager from "../engine/GameSessionManager";
import { attentionToForce } from "../engine/NeuroAdapter";

const HEIGHT = Dimensions.get("window").height;

export default function FocusBalloonGame({ onEnd }: any) {
  const [attention, setAttention] = useState(0);
  const [y, setY] = useState(HEIGHT / 2);

  const velocity = useRef(0);

  useEffect(() => {
    GameSessionManager.start("Focus Balloon");

    const poll = setInterval(async () => {
      const att = await GameSessionManager.getAttention();
      setAttention(att);
    }, 500);

    const physics = setInterval(() => {
      const force = attentionToForce(attention);

      velocity.current += (force - 0.5) * 2;
      velocity.current *= 0.95;

      setY((prev) => {
        let next = prev - velocity.current * 5;

        if (next < 50) next = 50;
        if (next > HEIGHT - 150) next = HEIGHT - 150;

        return next;
      });
    }, 16);

    return () => {
      clearInterval(poll);
      clearInterval(physics);
      GameSessionManager.stop();
      onEnd?.();
    };
  }, [attention]);

  return (
    <View style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      <Text style={{ position: "absolute", top: 50, alignSelf: "center" }}>
        Attention: {attention}
      </Text>

      <View
        style={{
          position: "absolute",
          left: "50%",
          marginLeft: -25,
          top: y,
          width: 50,
          height: 70,
          borderRadius: 25,
          backgroundColor: "#ff4d6d",
        }}
      />
    </View>
  );
}
