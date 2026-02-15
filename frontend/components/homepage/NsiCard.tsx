import { interpretNSIScore } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const NsiCard = ({
  nsi,
  normalized_nsi,
  delta_from_baseline,
  baseline_nsi,
  summary,
}: any) => {
  // -----------------------------
  // Decide which score to display
  // -----------------------------
  const displayScore =
    normalized_nsi !== null && normalized_nsi !== undefined
      ? normalized_nsi
      : nsi;

  const info = interpretNSIScore(displayScore);

  // -----------------------------
  // Reliability indicator
  // -----------------------------
  const reliability =
    summary?.reliability_ratio >= 0.9
      ? { label: "High Reliability", color: "#2e7d32" }
      : summary?.reliability_ratio >= 0.75
        ? { label: "Moderate Reliability", color: "#ed6c02" }
        : { label: "Low Reliability", color: "#d32f2f" };

  // -----------------------------
  // Improvement indicator
  // -----------------------------
  const delta =
    delta_from_baseline !== null && delta_from_baseline !== undefined
      ? delta_from_baseline
      : null;

  const deltaColor =
    delta === null ? "#666" : delta >= 0 ? "#2e7d32" : "#d32f2f";

  const deltaText =
    delta === null
      ? "Establishing baseline"
      : delta >= 0
        ? `+${delta.toFixed(1)} from baseline`
        : `${delta.toFixed(1)} from baseline`;

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
          Neural Stability Index (NSI)
        </Text>
      </View>

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
          {displayScore?.toFixed(1) ?? "--"}
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

      {/* Delta / Baseline status */}
      <Text
        style={{
          marginTop: 4,
          fontSize: 14,
          fontWeight: "600",
          color: deltaColor,
        }}
      >
        {deltaText}
      </Text>

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

      {/* Baseline reference (only after established) */}
      {baseline_nsi !== null && baseline_nsi !== undefined && (
        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "#666",
          }}
        >
          Baseline: {baseline_nsi.toFixed(1)}
        </Text>
      )}

      {/* Technical explanation */}
      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#666",
        }}
      >
        Composite score derived from calibrated AI confidence, neural
        biomarkers, signal stability, and signal integrity.
      </Text>
    </View>
  );
};

export default NsiCard;
