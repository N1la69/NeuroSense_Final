import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const InsightCard = ({ insight }: any) => {
  return (
    <View
      style={{
        marginTop: 20,
        padding: 18,
        borderRadius: 16,
        backgroundColor: "#eef2ff",
        borderLeftWidth: 5,
        borderLeftColor: "#4f7cff",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="analytics-outline" size={20} color="#4f7cff" />
        <Text
          style={{
            marginLeft: 8,
            fontSize: 16,
            fontWeight: "700",
            color: "#2c2c2c",
          }}
        >
          Progress Insight
        </Text>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 14,
          lineHeight: 20,
          color: "#444",
        }}
      >
        {insight}
      </Text>
    </View>
  );
};

export default InsightCard;
