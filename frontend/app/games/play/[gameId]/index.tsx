import { useRouter, useLocalSearchParams } from "expo-router";
import FocusBalloonGame from "@/games/focus-baloon/FocusBalloonGame";

export default function GameScreen() {
  const router = useRouter();

  const { gameId } = useLocalSearchParams();

  function handleEnd() {
    router.replace("/(dashboard)/home");
  }

  if (gameId === "focus-balloon") {
    return <FocusBalloonGame onEnd={handleEnd} />;
  }

  return null;
}
