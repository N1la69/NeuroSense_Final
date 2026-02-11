import { View, SafeAreaView } from "react-native";

export default function AppShell({ children }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
