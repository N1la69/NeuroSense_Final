import FocusBalloonGame from "@/games/focus-baloon/FocusBalloonGame";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function PlayGameScreen() {
  const router = useRouter();
  const { gameId } = useLocalSearchParams();

  const onEnd = () => {
    router.replace("/(dashboard)/home");
  };

  if (gameId === "focus-balloon") return <FocusBalloonGame onEnd={onEnd} />;

  return null;
}
