import { View } from "react-native";
import ThemeManager from "../engine/ThemeManager";

export default function FollowBall({ x, y, size, color }: any) {
  const theme = ThemeManager.getTheme();

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
        shadowOpacity: 0.8,
        shadowRadius: theme.glow,
      }}
    />
  );
}
