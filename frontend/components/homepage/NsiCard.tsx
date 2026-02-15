import { interpretNSIScore } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const NsiCard = ({ nsi, summary }: any) => {
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
        <Ionicons name="hardware-chip-outline" size={20} color="#4f7cff" />

        <Text
          style={{
            marginLeft: 8,
            fontSize: 16,
            fontWeight: "700",
            color: "#2c2c2c",
          }}
        >
          Neural Stability Index
        </Text>
      </View>

      {(() => {
        const info = interpretNSIScore(nsi);

        const reliability =
          summary.reliability_ratio >= 0.9
            ? { label: "High Reliability", color: "#2e7d32" }
            : summary.reliability_ratio >= 0.75
              ? { label: "Moderate Reliability", color: "#ed6c02" }
              : { label: "Low Reliability", color: "#d32f2f" };

        return (
          <>
            {/* Score Row */}
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
                  color: info.color,
                }}
              >
                {nsi.toFixed(1)}
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  marginLeft: 4,
                  color: info.color,
                }}
              >
                / 100
              </Text>
            </View>

            {/* Stability Label */}
            <Text
              style={{
                marginTop: 6,
                fontSize: 16,
                fontWeight: "700",
                color: info.color,
              }}
            >
              {info.label}
            </Text>

            {/* Explanation */}
            <Text
              style={{
                marginTop: 6,
                fontSize: 14,
                color: "#555",
                lineHeight: 20,
              }}
            >
              {info.explanation}
            </Text>

            {/* Divider */}
            <View
              style={{
                marginTop: 14,
                height: 1,
                backgroundColor: "#ddd",
              }}
            />

            {/* Reliability */}
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={reliability.color}
              />

              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 14,
                  fontWeight: "600",
                  color: reliability.color,
                }}
              >
                {reliability.label}
              </Text>
            </View>

            {/* Technical support info */}
            <Text
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "#666",
              }}
            >
              Based on signal quality, neural biomarkers, and AI confidence.
            </Text>
          </>
        );
      })()}
    </View>
  );
};

export default NsiCard;
