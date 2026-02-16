import { View } from "react-native";
import ColorBall from "./ColorBall";

export default function ColorGrid({ colors, onSelect }: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 40,
      }}
    >
      {colors.map((c: string, i: number) => (
        <ColorBall key={i} color={c} onPress={() => onSelect(c)} />
      ))}
    </View>
  );
}
