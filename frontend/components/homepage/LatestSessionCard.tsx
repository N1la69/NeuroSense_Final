import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const LatestSessionCard = ({ latest, scores }: any) => {
  return (
    <View
      style={{
        marginTop: 24,
        padding: 18,
        borderRadius: 16,
        backgroundColor: "#eef2ff",
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="pulse-outline" size={20} color="#4f7cff" />

        <Text
          style={{
            marginLeft: 8,
            fontSize: 16,
            fontWeight: "700",
            color: "#2c2c2c",
          }}
        >
          Latest Session Result
        </Text>
      </View>

      {/* Score */}
      <View
        style={{
          marginTop: 14,
          flexDirection: "row",
          alignItems: "baseline",
        }}
      >
        <Text
          style={{
            fontSize: 42,
            fontWeight: "800",
            color: latest.color,
          }}
        >
          {Math.round(scores[scores.length - 1] * 100)}
        </Text>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginLeft: 4,
            color: latest.color,
          }}
        >
          %
        </Text>
      </View>

      {/* Label */}
      <Text
        style={{
          marginTop: 6,
          fontSize: 16,
          fontWeight: "700",
          color: latest.color,
        }}
      >
        {latest.label}
      </Text>

      {/* Supporting explanation */}
      <Text
        style={{
          marginTop: 6,
          fontSize: 14,
          color: "#555",
          lineHeight: 20,
        }}
      >
        This reflects your child's attention engagement during the most recent
        session.
      </Text>

      {/* Divider */}
      <View
        style={{
          marginTop: 14,
          height: 1,
          backgroundColor: "#ddd",
        }}
      />

      {/* Footer meta */}
      <Text
        style={{
          marginTop: 10,
          fontSize: 13,
          color: "#666",
        }}
      >
        Higher scores indicate more stable and consistent attention patterns.
      </Text>
    </View>
  );
};

export default LatestSessionCard;
