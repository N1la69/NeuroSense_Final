import { View, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";

const HEIGHT = Dimensions.get("window").height;

export default function ColorGameBackground() {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(y, {
          toValue: -50,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#f8fafc",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: "#e0f2fe",
          top: HEIGHT * 0.2,
          left: -50,
          transform: [{ translateY: y }],
        }}
      />

      <Animated.View
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: 125,
          backgroundColor: "#f0fdf4",
          bottom: HEIGHT * 0.1,
          right: -80,
          transform: [{ translateY: y }],
        }}
      />
    </View>
  );
}
