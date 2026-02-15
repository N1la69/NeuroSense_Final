import { useRouter, useLocalSearchParams } from "expo-router";
import FollowBallGame from "@/games/follow-ball/FollowBallGame";

export default function GameScreen() {
  const router = useRouter();

  const { gameId } = useLocalSearchParams();

  function handleEnd() {
    router.replace("/(dashboard)/home");
  }

  if (gameId === "follow-ball") return <FollowBallGame onEnd={handleEnd} />;

  return null;
}
