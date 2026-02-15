import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const NeuralAnalysisCard = ({ summary }: any) => {
  return (
    <View
      style={{
        marginTop: 20,
        padding: 18,
        borderRadius: 16,
        backgroundColor: "#f5f7ff",
      }}
    >
      {/* Header */}
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
          Neural Analysis Breakdown
        </Text>
      </View>

      {/* Metric Bar Component */}
      {[
        {
          label: "AI Confidence",
          value: summary.calibrated_confidence_mean,
          icon: "hardware-chip-outline",
          color: "#4f7cff",
        },
        // {
        //   label: "Biomarker Strength",
        //   value: summary.biomarker_score_mean,
        //   icon: "pulse-outline",
        //   color: "#7b61ff",
        // },
        {
          label: "Response Stability",
          value: summary.stability_score,
          icon: "analytics-outline",
          color: "#2e7d32",
        },
        {
          label: "Signal Quality",
          value: summary.signal_quality_mean,
          icon: "radio-outline",
          color: "#ed6c02",
        },
      ].map((metric, i) => (
        <View key={i} style={{ marginTop: 14 }}>
          {/* Label Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={metric.icon as any}
                size={16}
                color={metric.color}
              />

              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {metric.label}
              </Text>
            </View>

            <Text
              style={{
                fontWeight: "700",
                color: metric.color,
              }}
            >
              {metric.value.toFixed(1)}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              marginTop: 6,
              height: 6,
              backgroundColor: "#e0e4ff",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${metric.value}%`,
                height: "100%",
                backgroundColor: metric.color,
              }}
            />
          </View>
        </View>
      ))}

      {/* Divider */}
      <View
        style={{
          marginTop: 16,
          height: 1,
          backgroundColor: "#ddd",
        }}
      />

      {/* Reliability + Data Quality */}
      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 14 }}>
          Reliability Ratio:{" "}
          <Text style={{ fontWeight: "700" }}>
            {(summary.reliability_ratio * 100).toFixed(0)}%
          </Text>
        </Text>

        <Text style={{ fontSize: 14, marginTop: 4 }}>
          Data Quality:{" "}
          <Text style={{ fontWeight: "700" }}>
            {summary.windows_used} / {summary.windows_total} samples used
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default NeuralAnalysisCard;
