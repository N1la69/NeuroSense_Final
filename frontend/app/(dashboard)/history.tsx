import { getSessions } from "@/utils/api";
import { getChild } from "@/utils/storage";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

export default function History() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const childId = await getChild();
    const data = await getSessions(childId!);
    setList(data);
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Session History</Text>

      {list.map((s) => (
        <View
          key={s.sessionId}
          style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: 8,
            borderRadius: 10,
          }}
        >
          <Text>Game: {s.game}</Text>

          <Text>Mean Attention: {s.summary?.mean_attention?.toFixed(1)}</Text>

          <Text>NSI: {s.nsi}</Text>

          <Text>Windows: {s.summary?.windows}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
