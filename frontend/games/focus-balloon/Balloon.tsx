import { View } from "react-native";
import ThemeManager from "@/games/engine/ThemeManager";

export default function Balloon({ y, attention }: any) {
  const theme = ThemeManager.getTheme();

  let color;

  if (attention >= 70) color = theme.balloonColors.high;
  else if (attention >= 55) color = theme.balloonColors.medium;
  else color = theme.balloonColors.low;

  return (
    <View
      style={{
        position: "absolute",
        left: "50%",
        marginLeft: -25,
        top: y,
        width: 50,
        height: 70,
        borderRadius: 25,
        backgroundColor: color,
      }}
    />
  );
}
