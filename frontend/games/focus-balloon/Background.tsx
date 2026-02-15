import { View } from "react-native";
import ThemeManager from "@/games/engine/ThemeManager";

export default function Background() {
  const theme = ThemeManager.getTheme();

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: theme.backgroundTop,
      }}
    />
  );
}
