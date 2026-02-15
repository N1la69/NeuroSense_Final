import { useRouter, useLocalSearchParams } from "expo-router";
import FocusBalloonGame from "@/games/focus-balloon/FocusBalloonGame";
import ThemeManager from "@/games/engine/ThemeManager";

export default function GameScreen() {
  const router = useRouter();

  const { gameId, theme } = useLocalSearchParams();
  ThemeManager.setTheme(theme === "fun" ? "fun" : "calm");

  function handleEnd() {
    router.replace("/(dashboard)/home");
  }

  if (gameId === "focus-balloon") {
    return <FocusBalloonGame onEnd={handleEnd} />;
  }

  return null;
}
