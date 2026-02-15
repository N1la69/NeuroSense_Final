import { View } from "react-native";

export default function RewardStar({ x, y }: any) {
  return (
    <View
      style={{
        position: "absolute",
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#facc15",
        shadowColor: "#facc15",
        shadowOpacity: 0.9,
        shadowRadius: 10,
      }}
    />
  );
}
