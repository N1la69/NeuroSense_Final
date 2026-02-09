import { TouchableOpacity, Text } from "react-native";

export default function Button({ title, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#2563eb",
        padding: 12,
        borderRadius: 10,
        marginVertical: 6,
      }}
    >
      <Text style={{ color: "white", textAlign: "center" }}>{title}</Text>
    </TouchableOpacity>
  );
}
