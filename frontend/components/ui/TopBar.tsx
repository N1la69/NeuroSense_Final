import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TopBar = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingHorizontal: 20,
        paddingBottom: 14,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      {/* Left: Logo + Name */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Placeholder Logo */}
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: "#4f7cff",
            marginRight: 8,
          }}
        />

        <Text style={{ fontSize: 18, fontWeight: "700" }}>NeuroSense</Text>
      </View>

      {/* Right: Profile */}
      <Pressable onPress={() => router.push("/profile" as any)}>
        <Ionicons name="person-circle-outline" size={28} color="#333" />
      </Pressable>
    </View>
  );
};

export default TopBar;
