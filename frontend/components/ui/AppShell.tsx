import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppShell({ children }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
