import Button from "@/components/Button";
import {
  getLiveInterpreted,
  startSession,
  startSessionForChild,
  stopSession,
} from "@/utils/api";
import { getChild, getParent } from "@/utils/storage";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";

export default function Home() {
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState<any>(null);

  // ----- POLLING EVERY 10 SECONDS -----
  useEffect(() => {
    let timer: any;

    if (running) {
      timer = setInterval(async () => {
        const data = await getLiveInterpreted();
        setLive(data);
      }, 10000);
    }

    return () => clearInterval(timer);
  }, [running]);

  const onStart = async () => {
    const parentId = await getParent();
    const childId = await getChild();

    await startSessionForChild(childId!, "Follow the Animal");
    setRunning(true);
  };

  const onStop = async () => {
    await stopSession();
    setRunning(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Parent Dashboard</Text>

      {!running ? (
        <Button title="Start EEG Session" onPress={onStart} />
      ) : (
        <Button title="Stop Session" onPress={onStop} />
      )}

      {live && (
        <View style={{ marginTop: 20 }}>
          <Text>Attention: {live.attention_index?.toFixed(1)}</Text>

          <Text>Status: {live.label}</Text>

          <Text>Recommended Games:</Text>

          {live.next_games?.map((g: string) => (
            <Text key={g}>• {g}</Text>
          ))}
        </View>
      )}
    </View>
  );
}
