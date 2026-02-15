import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";

const SessionReports = ({ sessions, scores }: any) => {
  return (
    <View style={{ marginTop: 28 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="documents-outline" size={20} color="#4f7cff" />

        <Text
          style={{
            marginLeft: 8,
            fontSize: 18,
            fontWeight: "700",
            color: "#2c2c2c",
          }}
        >
          Session Reports
        </Text>
      </View>

      {/* Session Cards */}
      {sessions.map((s: any, i: any) => {
        const score = Math.round(scores[i] * 100);

        const scoreColor =
          score >= 70 ? "#2e7d32" : score >= 55 ? "#ed6c02" : "#d32f2f";

        return (
          <Pressable
            key={s}
            onPress={() => router.push(`/session/${s}` as any)}
            style={({ pressed }) => ({
              marginTop: 14,
              padding: 16,
              borderRadius: 14,
              backgroundColor: "#f6f8ff",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            {/* Left Side */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Icon */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "#eef2ff",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="pulse-outline" size={18} color="#4f7cff" />
              </View>

              {/* Text Info */}
              <View>
                <Text style={{ fontWeight: "700", fontSize: 15 }}>
                  Session {i + 1}
                </Text>

                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 13,
                    color: "#666",
                  }}
                >
                  Neural attention assessment
                </Text>
              </View>
            </View>

            {/* Right Side */}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: scoreColor,
                }}
              >
                {score}%
              </Text>

              <Ionicons name="chevron-forward" size={18} color="#999" />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SessionReports;
