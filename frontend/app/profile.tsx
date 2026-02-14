import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import AppShell from "@/components/ui/AppShell";
import TopBar from "@/components/ui/TopBar";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <AppShell>
      <TopBar />

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Profile</Text>

        <View
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#f5f7ff",
          }}
        >
          <Text style={{ fontWeight: "600" }}>Parent Account</Text>

          <Text style={{ marginTop: 6 }}>Email: parent@example.com</Text>

          <Text style={{ marginTop: 6 }}>Child ID: CHD-XXXX</Text>
        </View>

        <Pressable
          onPress={() => router.replace("/login" as any)}
          style={{
            marginTop: 30,
            backgroundColor: "#d32f2f",
            padding: 14,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            Logout
          </Text>
        </Pressable>
      </View>
    </AppShell>
  );
}
