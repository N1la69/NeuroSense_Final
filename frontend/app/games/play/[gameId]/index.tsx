import { useRouter, useLocalSearchParams } from "expo-router";
import FollowBallGame from "@/games/follow-ball/FollowBallGame";
import ThemeManager from "@/games/engine/ThemeManager";
import FindColorGame from "@/games/find-color/FindColorGame";

export default function GameScreen() {
  const router = useRouter();

  const { gameId, theme } = useLocalSearchParams();

  ThemeManager.setTheme(theme === "fun" ? "fun" : "calm");

  function handleEnd() {
    router.replace("/games/result");
  }

  if (gameId === "follow-ball") return <FollowBallGame onEnd={handleEnd} />;

  if (gameId === "find-color") return <FindColorGame onEnd={handleEnd} />;

  return null;
}
