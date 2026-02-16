import { View, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import ThemeManager from "@/games/engine/ThemeManager";

const WIDTH = Dimensions.get("window").width;

export default function TherapyBackground() {
  const theme = ThemeManager.getTheme();

  const cloudX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(cloudX, {
        toValue: WIDTH,
        duration: theme.id === "calm" ? 40000 : 15000,
        useNativeDriver: true,
      }),
    ).start();
  }, [theme.id]);

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: theme.backgroundTop,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: 120,
          height: 60,
          borderRadius: 30,
          backgroundColor: "rgba(255,255,255,0.4)",
          transform: [{ translateX: cloudX }],
          top: 150,
        }}
      />

      <Animated.View
        style={{
          position: "absolute",
          width: 80,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.3)",
          transform: [{ translateX: cloudX }],
          top: 300,
        }}
      />
    </View>
  );
}
