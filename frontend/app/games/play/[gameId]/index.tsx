import { useRouter, useLocalSearchParams } from "expo-router";
import FollowBallGame from "@/games/follow-ball/FollowBallGame";
import ThemeManager from "@/games/engine/ThemeManager";

export default function GameScreen() {
  const router = useRouter();

  const { gameId, theme } = useLocalSearchParams();

  ThemeManager.setTheme(theme === "fun" ? "fun" : "calm");

  function handleEnd() {
    router.replace("/games/result");
  }

  if (gameId === "follow-ball") return <FollowBallGame onEnd={handleEnd} />;

  return null;
}
