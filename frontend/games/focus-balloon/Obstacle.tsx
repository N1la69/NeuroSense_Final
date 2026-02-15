import { View } from "react-native";

export default function Obstacle({ x, gapY }: any) {
  const GAP = 160;

  return (
    <>
      <View
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: 60,
          height: gapY,
          backgroundColor: "#475569",
        }}
      />

      <View
        style={{
          position: "absolute",
          left: x,
          top: gapY + GAP,
          width: 60,
          bottom: 0,
          backgroundColor: "#475569",
        }}
      />
    </>
  );
}
