import { View } from "react-native";

export default function FollowBall({ x, y, size, color }: any) {
  return (
    <View
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        shadowColor: color,
        shadowOpacity: 0.7,
        shadowRadius: 20,
      }}
    />
  );
}
